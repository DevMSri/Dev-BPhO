import numpy as np
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation, FFMpegWriter

g = 9.81
dt = 0.01
N_bounces = 10
e = 0.8
c = 0.1

x0 = 0
y0 = 10
vx0 = 2
vy0 = 10

x_drag_free = [x0]
y_drag_free = [y0]
x_drag = [x0]
y_drag = [y0]

x_curr_df = x0
y_curr_df = y0
vx_curr_df = vx0
vy_curr_df = vy0

x_curr_drag = x0
y_curr_drag = y0
vx_curr_drag = vx0
vy_curr_drag = vy0
bounces_df = 0

while bounces_df < N_bounces:
    x_next_df = x_curr_df + vx_curr_df * dt
    y_next_df = y_curr_df + vy_curr_df * dt - 0.5 * g * dt**2
    vy_next_df = vy_curr_df - g * dt

    if y_next_df < 0:
        y_next_df = 0
        vy_next_df = -e * vy_curr_df
        bounces_df += 1

    x_drag_free.append(x_next_df)
    y_drag_free.append(y_next_df)
    x_curr_df = x_next_df
    y_curr_df = y_next_df
    vy_curr_df = vy_next_df

bounces_drag = 0

while bounces_drag < N_bounces:
    v_curr_drag = np.sqrt(vx_curr_drag**2 + vy_curr_drag**2)
    drag_fx = -c * v_curr_drag * vx_curr_drag
    drag_fy = -c * v_curr_drag * vy_curr_drag
    x_next_drag = x_curr_drag + vx_curr_drag * dt + 0.5 * drag_fx * dt**2
    y_next_drag = y_curr_drag + vy_curr_drag * dt - 0.5 * g * dt**2 + 0.5 * drag_fy * dt**2
    vx_next_drag = vx_curr_drag + drag_fx * dt
    vy_next_drag = vy_curr_drag - g * dt + drag_fy * dt

    if y_next_drag < 0:
        y_next_drag = 0
        vy_next_drag = -e * vy_curr_drag
        bounces_drag += 1

    x_drag.append(x_next_drag)
    y_drag.append(y_next_drag)
    x_curr_drag = x_next_drag
    y_curr_drag = y_next_drag
    vx_curr_drag = vx_next_drag
    vy_curr_drag = vy_next_drag

x_drag_free = np.array(x_drag_free)
y_drag_free = np.array(y_drag_free)
x_drag = np.array(x_drag)
y_drag = np.array(y_drag)

fig, ax = plt.subplots()
ax.set_xlim(0, max(max(x_drag_free), max(x_drag)))
ax.set_ylim(0, max(max(y_drag_free), max(y_drag)) + 1)
line_df, = ax.plot([], [], 'b-', label='Drag-Free Trajectory')
point_df, = ax.plot([], [], 'bo')
line_drag, = ax.plot([], [], 'r-', label='Trajectory with Drag')
point_drag, = ax.plot([], [], 'ro')
ax.set_title('Projectile Trajectory Comparison: Drag-Free vs. With Drag')
ax.set_xlabel('Horizontal Distance (m)')
ax.set_ylabel('Vertical Distance (m)')
ax.legend()
ax.grid()

def init():
    line_df.set_data([], [])
    point_df.set_data([], [])
    line_drag.set_data([], [])
    point_drag.set_data([], [])
    return line_df, point_df, line_drag, point_drag


def animate(i):
    if i < len(x_drag_free):  # Ensure index is within bounds
        line_df.set_data(x_drag_free[:i+1], y_drag_free[:i+1])
        point_df.set_data([x_drag_free[i]], [y_drag_free[i]])
    if i < len(x_drag):  # Ensure index is within bounds
        line_drag.set_data(x_drag[:i+1], y_drag[:i+1])
        point_drag.set_data([x_drag[i]], [y_drag[i]])
    return line_df, point_df, line_drag, point_drag


ani = FuncAnimation(fig, animate, init_func=init, frames=len(x_drag_free), interval=20, blit=True)
writer = FFMpegWriter(fps=30, metadata={'artist': 'Devansh Srivastava'}, bitrate=1800)
ani.save("Task_9.mp4", writer=writer)

plt.show()
