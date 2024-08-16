import numpy as np
import matplotlib.pyplot as plt
from matplotlib.widgets import Slider


def projectile_motion(theta, u, g, h, dt=0.01):
    theta_rad = np.deg2rad(theta)
    ux = u * np.cos(theta_rad)
    uy = u * np.sin(theta_rad)
    x = [0.0]
    y = [h]
    t = [0.0]
    vx = ux
    vy = uy

    while y[-1] >= 0:
        vy -= g * dt
        x.append(x[-1] + vx * dt)
        y.append(y[-1] + vy * dt)
        t.append(t[-1] + dt)

    return np.array(x), np.array(y)


initial_theta = 45.0
initial_u = 10.0
g = 9.81
h = 2.0
dt = 0.01

x, y = projectile_motion(initial_theta, initial_u, g, h, dt)
fig, ax = plt.subplots()
plt.subplots_adjust(bottom=0.25)
trajectory, = ax.plot(x, y, label='Projectile Path')
ax.set_xlabel('Horizontal Distance (m)')
ax.set_ylabel('Vertical Distance (m)')
ax.set_title('Projectile Motion')
plt.legend()
plt.grid(True)
plt.show()
