# Required libraries
import numpy as np
import matplotlib.pyplot as plt

# Constants
g = 9.81  # Acceleration due to gravity (m/s^2)
X = 1000  # Target horizontal distance (m)
Y = 300   # Target vertical height (m)
u_given = 150  # Given initial launch speed (m/s)

# Function to calculate the minimum launch speed required to hit the target (X, Y)
def calculate_minimum_launch_speed(X, Y):
    u_min = np.sqrt(g * (Y + np.sqrt(X ** 2 + Y ** 2)))  # Minimum speed calculation
    return u_min

# Function to calculate the possible launch angles for a given speed to hit the target
def calculate_launch_angles(u, X, Y):
    discriminant = u ** 4 - g * (g * X ** 2 + 2 * u ** 2 * Y)  # Discriminant for solving quadratic equation
    if discriminant < 0:
        raise ValueError("No real solutions for the given parameters.")  # No valid angle if discriminant is negative
    theta_high = np.arctan((u ** 2 + np.sqrt(discriminant)) / (g * X))  # Higher launch angle
    theta_low = np.arctan((u ** 2 - np.sqrt(discriminant)) / (g * X))   # Lower launch angle
    return theta_high, theta_low

# Function to calculate the launch angle for the minimum launch speed
def calculate_min_speed_angle(X, Y):
    theta_min = np.arctan((Y + np.sqrt(X ** 2 + Y ** 2)) / X)  # Angle for minimum speed
    return theta_min

# Function to generate the trajectory for a given angle and speed
def generate_trajectory(theta, v0, num_points=500):
    t_flight = 2 * v0 * np.sin(theta) / g  # Total flight time
    t = np.linspace(0, t_flight, num_points)  # Time array
    x = v0 * np.cos(theta) * t  # Horizontal distance as a function of time
    y = v0 * np.sin(theta) * t - 0.5 * g * t ** 2  # Vertical distance as a function of time
    return x, y

# Function to generate the bounding parabola for the maximum range trajectory
def generate_bounding_parabola(u, X_max, num_points=500):
    x = np.linspace(0, X_max, num_points)  # Horizontal distance array
    y = (u**2 / (2 * g)) - (g / (2 * u**2)) * x**2  # Bounding parabola equation
    return x, y

# Function to calculate the angle for maximum range (which is 45 degrees)
def calculate_max_range_angle():
    return np.pi / 4  # 45 degrees in radians

# Calculate the minimum launch speed to hit the target
u_min = calculate_minimum_launch_speed(X, Y)

# Calculate the launch angles for the given speed
theta_high, theta_low = calculate_launch_angles(u_given, X, Y)

# Calculate the launch angle for the minimum speed
theta_min = calculate_min_speed_angle(X, Y)

# Calculate the angle for maximum range
theta_max_range = calculate_max_range_angle()

# Generate trajectories for different launch angles
x_low, y_low = generate_trajectory(theta_low, u_given)  # Trajectory for the low launch angle
x_high, y_high = generate_trajectory(theta_high, u_given)  # Trajectory for the high launch angle
x_min, y_min = generate_trajectory(theta_min, u_min)  # Trajectory for the minimum launch speed angle
x_max_range, y_max_range = generate_trajectory(theta_max_range, u_given)  # Trajectory for the max range angle

# Generate the bounding parabola for the given speed
x_bound, y_bound = generate_bounding_parabola(u_given, max(x_max_range))

# Plotting the trajectories
plt.figure(figsize=(10, 6))
plt.plot(x_low, y_low, label='Low ball', color='orange')  # Low angle trajectory
plt.plot(x_high, y_high, label='High ball', color='blue')  # High angle trajectory
plt.plot(x_min, y_min, label='Min u', color='gray')  # Minimum speed trajectory
plt.plot(x_max_range, y_max_range, label='Max range', color='red')  # Maximum range trajectory
plt.plot(x_bound, y_bound, label='Bounding parabola', color='purple', linestyle='dashed')  # Bounding parabola
plt.scatter([X], [Y], color='yellow', label='Target (X,Y)', zorder=5)  # Mark the target point
plt.xlabel('x / m')  # Label for the x-axis
plt.ylabel('y above launch height / m')  # Label for the y-axis
plt.title('Projectile to hit (X,Y)')  # Title of the plot
plt.legend()  # Display the legend
plt.grid()  # Display a grid
plt.show()  # Show the plot
