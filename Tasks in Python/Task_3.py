import numpy as np
import matplotlib.pyplot as plt

g = 9.81
X = 1000
Y = 300
u_given = 150

def calculate_minimum_launch_speed(X, Y):
    u_min = np.sqrt(g * (Y + np.sqrt(X ** 2 + Y ** 2)))
    return u_min


def calculate_launch_angles(u, X, Y):
    discriminant = u ** 4 - g * (g * X ** 2 + 2 * u ** 2 * Y)
    if discriminant < 0:
        raise ValueError("No real solutions for the given parameters.")
    theta_high = np.arctan((u ** 2 + np.sqrt(discriminant)) / (g * X))
    theta_low = np.arctan((u ** 2 - np.sqrt(discriminant)) / (g * X))
    return theta_high, theta_low


def calculate_min_speed_angle(X, Y):
    theta_min = np.arctan((Y + np.sqrt(X ** 2 + Y ** 2)) / X)
    return theta_min


def generate_trajectory(theta, v0, X_target, Y_target, num_points=500):
    t_flight = 2 * v0 * np.sin(theta) / g
    t = np.linspace(0, t_flight, num_points)
    x = v0 * np.cos(theta) * t
    y = v0 * np.sin(theta) * t - 0.5 * g * t ** 2
    mask = x <= X_target
    x = x[mask]
    y = y[mask]
    if len(x) == 0 or len(y) == 0:
        raise ValueError("No trajectory data points before reaching the target.")
    x[-1], y[-1] = X_target, Y_target
    return x, y


u_min = calculate_minimum_launch_speed(X, Y)
theta_high, theta_low = calculate_launch_angles(u_given, X, Y)
theta_min = calculate_min_speed_angle(X, Y)

x_low, y_low = generate_trajectory(theta_low, u_given, X, Y)
x_high, y_high = generate_trajectory(theta_high, u_given, X, Y)
x_min, y_min = generate_trajectory(theta_min, u_min, X, Y)

plt.figure(figsize=(10, 6))
plt.plot(x_low, y_low, label='Low ball', color='orange')
plt.plot(x_high, y_high, label='High ball', color='blue')
plt.plot(x_min, y_min, label='Min u', color='gray')
plt.scatter([X], [Y], color='yellow', label='Target (X,Y)', zorder=5)
plt.xlabel('x / m')
plt.ylabel('y above launch height / m')
plt.title('Projectile to hit (X,Y)')
plt.legend()
plt.grid()
plt.show()
