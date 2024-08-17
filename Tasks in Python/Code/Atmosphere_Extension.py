# Required libraries
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.animation as animation
from scipy.integrate import solve_ivp
from matplotlib.animation import FFMpegWriter

# Constants
g = 9.81         # Acceleration due to gravity (m/s^2)
A = 0.002        # Cross-sectional area of the projectile (m^2)
m = 0.01         # Mass of the projectile (kg)
Cd = 0.3         # Drag coefficient (dimensionless)
rho_0 = 1.225    # Air density at sea level (kg/m^3)
H = 8500         # Scale height for atmospheric density (m)

# Function to calculate air density as a function of altitude
def air_density(y):
    return rho_0 * np.exp(-y / H)

# Function to calculate drag force on the projectile
def drag_force(vx, vy, y):
    v = np.sqrt(vx ** 2 + vy ** 2)  # Magnitude of velocity vector
    rho = air_density(y)            # Air density at altitude y
    return 0.5 * Cd * A * rho * v ** 2 / m  # Drag force per unit mass

# Equations of motion with drag
def equations_with_drag(t, z):
    vx, vy, x, y = z  # Decompose state vector
    D = drag_force(vx, vy, y)  # Calculate drag force
    ax = -D * vx / np.sqrt(vx ** 2 + vy ** 2)  # Acceleration in x-direction
    ay = -g - D * vy / np.sqrt(vx ** 2 + vy ** 2)  # Acceleration in y-direction (gravity + drag)
    return [ax, ay, vx, vy]  # Return derivatives for ODE solver

# Equations of motion without drag
def equations_without_drag(t, z):
    vx, vy, x, y = z  # Decompose state vector
    return [0, -g, vx, vy]  # Only gravity affects the projectile

# Function to solve the projectile motion equations
def solve_projectile(u, theta, h, with_drag=True):
    theta_rad = np.radians(theta)  # Convert angle to radians
    vx0 = u * np.cos(theta_rad)  # Initial velocity in x-direction
    vy0 = u * np.sin(theta_rad)  # Initial velocity in y-direction
    z0 = [vx0, vy0, 0, h]  # Initial state vector [vx, vy, x, y]
    t_span = (0, 20)  # Time span for the simulation
    t_eval = np.linspace(0, 20, 2000)  # Time points to evaluate the solution

    if with_drag:
        # Solve the equations of motion with drag
        sol = solve_ivp(equations_with_drag, t_span, z0, t_eval=t_eval)
    else:
        # Solve the equations of motion without drag
        sol = solve_ivp(equations_without_drag, t_span, z0, t_eval=t_eval)

    # Return time, x and y positions, and velocities in x and y directions
    return sol.t, sol.y[2], sol.y[3], sol.y[0], sol.y[1]

# Function to determine the time when the projectile hits the x-axis (ground)
def time_to_reach_x_axis(x, y, t):
    for i in range(len(y)):
        if y[i] <= 0:  # If the projectile reaches or goes below the ground
            return t[i], i  # Return the time and index when it happens
    return np.nan, len(y) - 1  # Return NaN if it never hits the ground

# Function to plot the trajectories with and without drag
def plot_trajectories():
    u = 10       # Initial speed (m/s)
    theta = 45   # Launch angle (degrees)
    h = 2        # Initial height (m)

    # Solve for trajectory with and without drag
    t_drag, x_drag, y_drag, vx_drag, vy_drag = solve_projectile(u, theta, h, with_drag=True)
    t_no_drag, x_no_drag, y_no_drag, vx_no_drag, vy_no_drag = solve_projectile(u, theta, h, with_drag=False)
    
    # Determine the time and index when each trajectory hits the ground
    time_drag, idx_drag = time_to_reach_x_axis(x_drag, y_drag, t_drag)
    time_no_drag, idx_no_drag = time_to_reach_x_axis(x_no_drag, y_no_drag, t_no_drag)

    # The animation will run until the later of the two trajectories hits the ground
    stop_idx = max(idx_drag, idx_no_drag)

    # Create figure and axes for the animation
    fig, ax = plt.subplots(figsize=(12, 6))
    plt.subplots_adjust(right=0.75)

    # Initialize plot lines and points for animation
    line_drag, = ax.plot([], [], label='With Drag', color='blue')
    line_no_drag, = ax.plot([], [], label='Without Drag', linestyle='--', color='green')
    point_drag, = ax.plot([], [], 'o', color='blue')
    point_no_drag, = ax.plot([], [], 'o', color='green')

    # Create a separate axis for displaying text information
    info_ax = fig.add_axes([0.8, 0.1, 0.15, 0.8], frameon=False)
    info_box_drag = info_ax.text(0.5, 0.9, '', transform=info_ax.transAxes, fontsize=12,
                                 verticalalignment='top', horizontalalignment='center',
                                 bbox=dict(facecolor='white', edgecolor='black', boxstyle='round,pad=0.5'))

    info_box_no_drag = info_ax.text(0.5, 0.5, '', transform=info_ax.transAxes, fontsize=12,
                                    verticalalignment='top', horizontalalignment='center',
                                    bbox=dict(facecolor='white', edgecolor='black', boxstyle='round,pad=0.5'))

    # Hide the axes for the info box
    info_ax.set_xlim(0, 1)
    info_ax.set_ylim(0, 1)
    info_ax.axis('off')
    
    # Set axes limits and labels for the main plot
    ax.set_xlim(0, 20)
    ax.set_ylim(0, 10)
    ax.set_xlabel('Distance (m)')
    ax.set_ylabel('Height (m)')
    ax.set_title(f'Trajectories (u={u} m/s, theta={theta}°, h={h} m)')
    ax.legend()
    ax.grid(True)

    # Variables to store final speed and pressure values
    final_speed_drag = final_pressure_drag = final_time_drag = 0
    final_speed_no_drag = final_pressure_no_drag = final_time_no_drag = 0

    # Initialization function for the animation
    def init():
        line_drag.set_data([], [])
        line_no_drag.set_data([], [])
        point_drag.set_data([], [])
        point_no_drag.set_data([], [])
        info_box_drag.set_text('')
        info_box_no_drag.set_text('')
        return line_drag, line_no_drag, point_drag, point_no_drag, info_box_drag, info_box_no_drag

    # Animation function that updates the plot at each frame
    def animate(i):
        nonlocal final_speed_drag, final_pressure_drag, final_time_drag
        nonlocal final_speed_no_drag, final_pressure_no_drag, final_time_no_drag

        if i <= stop_idx:
            # Update trajectory with drag
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
                line_drag.set_data(x_drag[:i + 1], y_drag[:i + 1])
                point_drag.set_data([x_drag[i]], [0])

            # Update trajectory without drag
            if y_no_drag[i] >= 0:
                x_data_no_drag = x_no_drag[:i + 1]
                y_data_no_drag = y_no_drag[:i + 1]
                vx_no_drag_curr = vx_no_drag[i]
                vy_no_drag_curr = vy_no_drag[i]
                final_speed_no_drag = np.sqrt(vx_no_drag_curr ** 2 + vy_no_drag_curr ** 2)
                final_pressure_no_drag = 0  # No drag force
                final_time_no_drag = t_no_drag[i]

                line_no_drag.set_data(x_data_no_drag, y_data_no_drag)
                point_no_drag.set_data([x_data_no_drag[-1]], [y_data_no_drag[-1]])
            else:
                line_no_drag.set_data(x_no_drag[:i + 1], y_no_drag[:i + 1])
                point_no_drag.set_data([x_no_drag[i]], [0])

            # Update the information boxes with current data
            info_box_drag.set_text(
                f'With Drag:\nSpeed: {final_speed_drag:.2f} m/s\nPressure: {final_pressure_drag:.2f} N/m²\nTime to x-axis: {final_time_drag:.2f} s'
            )

            info_box_no_drag.set_text(
                f'Without Drag:\nSpeed: {final_speed_no_drag:.2f} m/s\nPressure: {final_pressure_no_drag:.2f} N/m²\nTime to x-axis: {final_time_no_drag:.2f} s'
            )

        return line_drag, line_no_drag, point_drag, point_no_drag, info_box_drag, info_box_no_drag

    # Create the animation
    ani = animation.FuncAnimation(fig, animate, frames=stop_idx+1, init_func=init, blit=True, interval=50, repeat=False)

    # Save the animation as a video file
    writer = FFMpegWriter(fps=30, metadata={'artist': 'Your Name'}, bitrate=1800)
    ani.save("Atmosphere_Extension.mp4", writer=writer)

    # Show the plot
    plt.show()

# Call the function to plot the trajectories
plot_trajectories()
