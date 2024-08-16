import numpy as np
import matplotlib.pyplot as plt

g = 10
v0 = 10
h = 0

def projectile_motion(theta):
    theta_rad = np.radians(theta)
    T = 4 * v0 * np.sin(theta_rad) / g
    t = np.linspace(0, T, 1000)
    x = v0 * np.cos(theta_rad) * t
    y = v0 * np.sin(theta_rad) * t - 0.5 * g * t**2

    sin_theta = np.sin(theta_rad)
    t1 = (3 * v0 * sin_theta) / (2 * g)
    t2 = (3 * v0 * sin_theta) / (2 * g) - np.sqrt((v0 * sin_theta)**2 - (8 * g * h) / 9) / g

    x_max = v0 * np.cos(theta_rad) * t1
    y_max = v0 * np.sin(theta_rad) * t1 - 0.5 * g * t1**2
    r_max = np.sqrt(x_max**2 + y_max**2)

    x_min = v0 * np.cos(theta_rad) * t2
    y_min = v0 * np.sin(theta_rad) * t2 - 0.5 * g * t2**2
    r_min = np.sqrt(x_min**2 + y_min**2)

    return t, x, y, x_max, y_max, x_min, y_min, r_max, r_min


n = 5
angles = np.linspace(70.5, 80.5, n)
plt.figure(figsize=(10, 6))

for theta in angles:
    t, x, y, x_max, y_max, x_min, y_min, r_max, r_min = projectile_motion(theta)
    plt.plot(x, y, label=f'Projectile Path (θ={theta:.1f}°)')
    plt.scatter([x_max], [y_max], color='red', marker='*', label='Maximum' if theta == angles[0] else "")
    plt.scatter([x_min], [y_min], color='blue', marker='*', label='Minimum' if theta == angles[0] else "")

plt.xlabel('Distance (m)')
plt.ylabel('Height (m)')
plt.legend()
plt.grid(True)
plt.title('Projectile Motion with Maxima and Minima')
plt.show()
plt.figure(figsize=(10, 6))

for theta in angles:
    t, x, y, x_max, y_max, x_min, y_min, r_max, r_min = projectile_motion(theta)
    range_values = np.sqrt(x**2 + y**2)
    plt.plot(t, range_values, label=f'Projectile Range (θ={theta:.1f}°)')
    plt.scatter([t[np.argmin(abs(range_values - r_max))]], [r_max], color='red', marker='*', label='Maximum' if theta == angles[0] else "")
    plt.scatter([t[np.argmin(abs(range_values - r_min))]], [r_min], color='blue', marker='*', label='Minimum' if theta == angles[0] else "")

plt.xlabel('Time (s)')
plt.ylabel('Range (m)')
plt.legend()
plt.grid(True)
plt.title('Range Over Time with Maxima and Minima')
plt.show()
