import numpy as np
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation, FFMpegWriter

g = 9.81
dt = 0.01
N_bounces = 5
e = 0.8

x0 = 0
y0 = 10
vx0 = 2
vy0 = 10

x = [x0]
y = [y0]

x_curr = x0
y_curr = y0
vx_curr = vx0
vy_curr = vy0
bounces = 0

while bounces < N_bounces:
    x_next = x_curr + vx_curr * dt
    y_next = y_curr + vy_curr * dt - 0.5 * g * dt**2
    vy_next = vy_curr - g * dt

    if y_next < 0:
        y_next = 0
        vy_next = -e * vy_curr
        bounces += 1

    x.append(x_next)
    y.append(y_next)
    x_curr = x_next
    y_curr = y_next
    vy_curr = vy_next

x = np.array(x)
y = np.array(y)

fig, ax = plt.subplots()
ax.set_xlim(0, max(x))
ax.set_ylim(0, max(y) + 1)
line, = ax.plot([], [], 'b-', label='Projectile trajectory')
point, = ax.plot([], [], 'ro')
ax.set_title('Projectile Trajectory with Bounces')
ax.set_xlabel('Horizontal Distance (m)')
ax.set_ylabel('Vertical Distance (m)')
ax.legend()
ax.grid()

def init():
    line.set_data([], [])
    point.set_data([], [])
    return line, point


def animate(i):
    line.set_data(x[:i+1], y[:i+1])
    point.set_data([x[i]], [y[i]])
    return line, point


ani = FuncAnimation(fig, animate, init_func=init, frames=len(x), interval=20, blit=True)
writer = FFMpegWriter(fps=30, metadata={'artist': 'Devansh Srivastava'}, bitrate=1800)
ani.save("Task_8.mp4", writer=writer)

plt.show()
