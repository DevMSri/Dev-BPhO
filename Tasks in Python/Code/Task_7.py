# Required libraries
import numpy as np
import matplotlib.pyplot as plt

# Constants
g = 10     # Acceleration due to gravity (m/s^2)
v0 = 10    # Initial velocity (m/s)
h = 0      # Initial height (m)

# Function to compute projectile motion properties
def projectile_motion(theta):
    theta_rad = np.radians(theta)  # Convert angle to radians

    # Time of flight
    T = 4 * v0 * np.sin(theta_rad) / g
    
    # Time array for trajectory computation
    t = np.linspace(0, T, 1000)
    
    # Horizontal and vertical positions
    x = v0 * np.cos(theta_rad) * t
    y = v0 * np.sin(theta_rad) * t - 0.5 * g * t**2

    # Compute times for maximum and minimum range
    sin_theta = np.sin(theta_rad)
    t1 = (3 * v0 * sin_theta) / (2 * g)
    t2 = (3 * v0 * sin_theta) / (2 * g) - np.sqrt((v0 * sin_theta)**2 - (8 * g * h) / 9) / g

    # Maximum range calculations
    x_max = v0 * np.cos(theta_rad) * t1
    y_max = v0 * np.sin(theta_rad) * t1 - 0.5 * g * t1**2
    r_max = np.sqrt(x_max**2 + y_max**2)

    # Minimum range calculations
    x_min = v0 * np.cos(theta_rad) * t2
    y_min = v0 * np.sin(theta_rad) * t2 - 0.5 * g * t2**2
    r_min = np.sqrt(x_min**2 + y_min**2)

    return t, x, y, x_max, y_max, x_min, y_min, r_max, r_min

# Number of angles to evaluate
n = 5
angles = np.linspace(70.5, 80.5, n)

# Plotting projectile paths
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

# Plotting range over time
plt.figure(figsize=(10, 6))

for theta in angles:
    t, x, y, x_max, y_max, x_min, y_min, r_max, r_min = projectile_motion(theta)
    range_values = np.sqrt(x**2 + y**2)  # Compute range from horizontal and vertical positions
    plt.plot(t, range_values, label=f'Projectile Range (θ={theta:.1f}°)')
    plt.scatter([t[np.argmin(abs(range_values - r_max))]], [r_max], color='red', marker='*', label='Maximum' if theta == angles[0] else "")
    plt.scatter([t[np.argmin(abs(range_values - r_min))]], [r_min], color='blue', marker='*', label='Minimum' if theta == angles[0] else "")

plt.xlabel('Time (s)')
plt.ylabel('Range (m)')
plt.legend()
plt.grid(True)
plt.title('Range Over Time with Maxima and Minima')
plt.show()
