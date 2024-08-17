# Required libraries
import numpy as np
import matplotlib.pyplot as plt

# Function to calculate the optimal angle for maximum range
def optimal_angle(u, h, g):
    return np.arcsin(1 / np.sqrt(2 + 2 * g * h / u ** 2))

# Function to calculate the range of the trajectory for a given angle and initial height
def range_of_trajectory(u, theta, h, g):
    theta_rad = np.radians(theta)
    return (u ** 2 / g) * (
        np.sin(2 * theta_rad) / (np.cos(theta_rad) + np.sqrt(np.sin(theta_rad) ** 2 + (2 * g * h) / (u ** 2)))
    )

# Function to calculate the maximum possible range
def range_maximum(u, h, g):
    theta_max = optimal_angle(u, h, g)
    return (u ** 2 / g) * np.sqrt(1 + (2 * g * h) / (u ** 2))

# Function to generate the trajectory data points for a given angle
def trajectory(u, theta, h, g):
    theta_rad = np.radians(theta)
    t_flight = (u * np.sin(theta_rad) + np.sqrt((u * np.sin(theta_rad)) ** 2 + 2 * g * h)) / g  # Total flight time
    t = np.linspace(0, t_flight, num=500)  # Time array
    x = u * np.cos(theta_rad) * t  # Horizontal distance as a function of time
    y = h + u * np.sin(theta_rad) * t - 0.5 * g * t ** 2  # Vertical distance as a function of time
    return x, y

# Function to plot the trajectories for both the given angle and the optimal angle
def plot_trajectories(u, h, g, given_theta):
    theta_optimal = np.degrees(optimal_angle(u, h, g))  # Calculate the optimal angle in degrees
    x_given, y_given = trajectory(u, given_theta, h, g)  # Trajectory for the given angle
    x_optimal, y_optimal = trajectory(u, theta_optimal, h, g)  # Trajectory for the optimal angle

    plt.figure(figsize=(12, 6))
    plt.plot(x_given, y_given, label=f'Given Angle: {given_theta} degrees', color='blue')  # Plot given angle trajectory
    plt.plot(x_optimal, y_optimal, label=f'Optimal Angle: {theta_optimal:.2f} degrees', color='red', linestyle='--')  # Plot optimal angle trajectory
    plt.title('Projectile Trajectories')  # Title of the plot
    plt.xlabel('Horizontal Distance (m)')  # Label for the x-axis
    plt.ylabel('Vertical Distance (m)')  # Label for the y-axis
    plt.legend()  # Display the legend
    plt.grid(True)  # Display a grid
    plt.show()  # Show the plot

# Parameters
u = 10             # Initial speed (m/s)
h = 2              # Initial height (m)
g = 9.81           # Acceleration due to gravity (m/s^2)
given_theta = 60   # Given launch angle (degrees)

# Plot the trajectories for the given and optimal angles
plot_trajectories(u, h, g, given_theta)
