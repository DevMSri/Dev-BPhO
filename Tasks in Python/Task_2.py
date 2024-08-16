import numpy as np
import matplotlib.pyplot as plt

u = 50
theta = 45
h = 10
g = 9.81

theta_rad = np.radians(theta)
x_a = (u**2 / g) * np.sin(theta_rad) * np.cos(theta_rad)
y_a = h + (u**2 / (2 * g)) * np.sin(theta_rad)**2
R = (u**2 / g) * (np.sin(theta_rad) * np.cos(theta_rad) + np.cos(theta_rad) * np.sqrt(np.sin(theta_rad)**2 + (2 * g * h) / u**2))

x = np.linspace(0, R, 500)
y = h + x * np.tan(theta_rad) - (g / (2 * u**2 * np.cos(theta_rad)**2)) * x**2

plt.figure(figsize=(10, 5))
plt.plot(x, y, label='Projectile Trajectory')
plt.scatter([x_a], [y_a], color='red', marker='x', s=100, label='Apogee')  # Mark the apogee with a cross
plt.title('Projectile Trajectory')
plt.xlabel('Horizontal Distance (m)')
plt.ylabel('Vertical Distance (m)')
plt.legend()
plt.grid(True)
plt.show()
