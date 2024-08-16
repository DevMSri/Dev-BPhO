import numpy as np
import matplotlib.pyplot as plt

def optimal_angle(u, h, g):
    return np.arcsin(1 / np.sqrt(2 + 2 * g * h / u ** 2))


def range_of_trajectory(u, theta, h, g):
    theta_rad = np.radians(theta)
    return (u ** 2 / g) * (
                np.sin(2 * theta_rad) / (np.cos(theta_rad) + np.sqrt(np.sin(theta_rad) ** 2 + (2 * g * h) / (u ** 2))))


def range_maximum(u, h, g):
    theta_max = optimal_angle(u, h, g)
    return (u ** 2 / g) * np.sqrt(1 + (2 * g * h) / (u ** 2))


def trajectory(u, theta, h, g):
    theta_rad = np.radians(theta)
    t_flight = (u * np.sin(theta_rad) + np.sqrt((u * np.sin(theta_rad)) ** 2 + 2 * g * h)) / g
    t = np.linspace(0, t_flight, num=500)
    x = u * np.cos(theta_rad) * t
    y = h + u * np.sin(theta_rad) * t - 0.5 * g * t ** 2
    return x, y


def plot_trajectories(u, h, g, given_theta):
    theta_optimal = np.degrees(optimal_angle(u, h, g))
    x_given, y_given = trajectory(u, given_theta, h, g)
    x_optimal, y_optimal = trajectory(u, theta_optimal, h, g)

    plt.figure(figsize=(12, 6))
    plt.plot(x_given, y_given, label=f'Given Angle: {given_theta} degrees', color='blue')
    plt.plot(x_optimal, y_optimal, label=f'Optimal Angle: {theta_optimal:.2f} degrees', color='red', linestyle='--')
    plt.title('Projectile Trajectories')
    plt.xlabel('Horizontal Distance (m)')
    plt.ylabel('Vertical Distance (m)')
    plt.legend()
    plt.grid(True)
    plt.show()


u = 10
h = 2
g = 9.81
given_theta = 60

plot_trajectories(u, h, g, given_theta)
