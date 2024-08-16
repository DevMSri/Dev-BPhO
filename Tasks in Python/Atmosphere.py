import numpy as np
import matplotlib.pyplot as plt
import matplotlib.animation as animation
from scipy.integrate import solve_ivp

g = 9.81
A = 0.002
m = 0.01
Cd = 0.3
rho_0 = 1.225
H = 8500

def air_density(y):
    return rho_0 * np.exp(-y / H)

def drag_force(vx, vy, y):
    v = np.sqrt(vx ** 2 + vy ** 2)
    rho = air_density(y)
    return 0.5 * Cd * A * rho * v ** 2 / m

def equations_with_drag(t, z):
    vx, vy, x, y = z
    D = drag_force(vx, vy, y)
    ax = -D * vx / np.sqrt(vx ** 2 + vy ** 2)
    ay = -g - D * vy / np.sqrt(vx ** 2 + vy ** 2)
    return [ax, ay, vx, vy]

def equations_without_drag(t, z):
    vx, vy, x, y = z
    return [0, -g, vx, vy]

def solve_projectile(u, theta, h, with_drag=True):
    theta_rad = np.radians(theta)
    vx0 = u * np.cos(theta_rad)
    vy0 = u * np.sin(theta_rad)
    z0 = [vx0, vy0, 0, h]
    t_span = (0, 20)
    t_eval = np.linspace(0, 20, 2000)

    if with_drag:
        sol = solve_ivp(equations_with_drag, t_span, z0, t_eval=t_eval)
    else:
        sol = solve_ivp(equations_without_drag, t_span, z0, t_eval=t_eval)

    return sol.t, sol.y[2], sol.y[3], sol.y[0], sol.y[1]

def time_to_reach_x_axis(x, y, t):
    for i in range(len(y)):
        if y[i] <= 0:
            return t[i]
    return np.nan

def plot_trajectories():
    u = 10
    theta = 45
    h = 2

    t_drag, x_drag, y_drag, vx_drag, vy_drag = solve_projectile(u, theta, h, with_drag=True)
    t_no_drag, x_no_drag, y_no_drag, vx_no_drag, vy_no_drag = solve_projectile(u, theta, h, with_drag=False)
    time_drag = time_to_reach_x_axis(x_drag, y_drag, t_drag)
    time_no_drag = time_to_reach_x_axis(x_no_drag, y_no_drag, t_no_drag)

    fig, ax = plt.subplots(figsize=(12, 6))
    plt.subplots_adjust(right=0.75)

    line_drag, = ax.plot([], [], label='With Drag', color='blue')
    line_no_drag, = ax.plot([], [], label='Without Drag', linestyle='--', color='green')
    point_drag, = ax.plot([], [], 'o', color='blue')
    point_no_drag, = ax.plot([], [], 'o', color='green')

    info_ax = fig.add_axes([0.8, 0.1, 0.15, 0.8], frameon=False)
    info_box_drag = info_ax.text(0.5, 0.9, '', transform=info_ax.transAxes, fontsize=12,
                                 verticalalignment='top', horizontalalignment='center',
                                 bbox=dict(facecolor='white', edgecolor='black', boxstyle='round,pad=0.5'))

    info_box_no_drag = info_ax.text(0.5, 0.5, '', transform=info_ax.transAxes, fontsize=12,
                                    verticalalignment='top', horizontalalignment='center',
                                    bbox=dict(facecolor='white', edgecolor='black', boxstyle='round,pad=0.5'))

    info_ax.set_xlim(0, 1)
    info_ax.set_ylim(0, 1)
    info_ax.axis('off')
    ax.set_xlim(0, 20)
    ax.set_ylim(0, 10)
    ax.set_xlabel('Distance (m)')
    ax.set_ylabel('Height (m)')
    ax.set_title(f'Trajectories (u={u} m/s, theta={theta}°, h={h} m)')
    ax.legend()
    ax.grid(True)

    final_speed_drag = final_pressure_drag = final_time_drag = 0
    final_speed_no_drag = final_pressure_no_drag = final_time_no_drag = 0

    def init():
        line_drag.set_data([], [])
        line_no_drag.set_data([], [])
        point_drag.set_data([], [])
        point_no_drag.set_data([], [])
        info_box_drag.set_text('')
        info_box_no_drag.set_text('')
        return line_drag, line_no_drag, point_drag, point_no_drag, info_box_drag, info_box_no_drag

    def animate(i):
        nonlocal final_speed_drag, final_pressure_drag, final_time_drag
        nonlocal final_speed_no_drag, final_pressure_no_drag, final_time_no_drag

        if y_drag[i] >= 0:
            x_data_drag = x_drag[:i + 1]
            y_data_drag = y_drag[:i + 1]
            vx_drag_curr = vx_drag[i]
            vy_drag_curr = vy_drag[i]
            final_speed_drag = np.sqrt(vx_drag_curr ** 2 + vy_drag_curr ** 2)
            final_pressure_drag = drag_force(vx_drag_curr, vy_drag_curr, y_drag[i])
            final_time_drag = t_drag[i]

            line_drag.set_data(x_data_drag, y_data_drag)
            point_drag.set_data([x_data_drag[-1]], [y_data_drag[-1]])
        else:
            line_drag.set_data(x_drag, y_drag)
            point_drag.set_data([x_drag[-1]], [y_drag[-1]])

        if y_no_drag[i] >= 0:
            x_data_no_drag = x_no_drag[:i + 1]
            y_data_no_drag = y_no_drag[:i + 1]
            vx_no_drag_curr = vx_no_drag[i]
            vy_no_drag_curr = vy_no_drag[i]
            final_speed_no_drag = np.sqrt(vx_no_drag_curr ** 2 + vy_no_drag_curr ** 2)
            final_pressure_no_drag = 0  # Should be zero as there's no drag force
            final_time_no_drag = t_no_drag[i]

            line_no_drag.set_data(x_data_no_drag, y_data_no_drag)
            point_no_drag.set_data([x_data_no_drag[-1]], [y_data_no_drag[-1]])
        else:
            line_no_drag.set_data(x_no_drag, y_no_drag)
            point_no_drag.set_data([x_no_drag[-1]], [y_no_drag[-1]])

        info_box_drag.set_text(
            f'With Drag:\nSpeed: {final_speed_drag:.2f} m/s\nPressure: {final_pressure_drag:.2f} N/m²\nTime to x-axis: {final_time_drag:.2f} s'
        )

        info_box_no_drag.set_text(
            f'Without Drag:\nSpeed: {final_speed_no_drag:.2f} m/s\nPressure: {final_pressure_no_drag:.2f} N/m²\nTime to x-axis: {final_time_no_drag:.2f} s'
        )

        if y_drag[i] < 0 and y_no_drag[i] < 0:
            ani.event_source.stop()

        return line_drag, line_no_drag, point_drag, point_no_drag, info_box_drag, info_box_no_drag

    def finalize(*args, **kwargs):
        info_box_drag.set_text(
            f'With Drag:\nSpeed: {final_speed_drag:.2f} m/s\nPressure: {final_pressure_drag:.2f} N/m²\nTime to x-axis: {final_time_drag:.2f} s'
        )
        info_box_no_drag.set_text(
            f'Without Drag:\nSpeed: {final_speed_no_drag:.2f} m/s\nPressure: {final_pressure_no_drag:.2f} N/m²\nTime to x-axis: {final_time_no_drag:.2f} s'
        )

    final_speed_drag = final_pressure_drag = final_time_drag = 0
    final_speed_no_drag = final_pressure_no_drag = final_time_no_drag = 0
    ani = animation.FuncAnimation(fig, animate, frames=len(x_drag), init_func=init, blit=True, interval=50, repeat=False)
    ani.event_source.add_callback(finalize)

    plt.show()


plot_trajectories()
