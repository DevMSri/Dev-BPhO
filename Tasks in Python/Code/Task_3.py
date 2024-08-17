# Required libraries
import numpy as np
import matplotlib.pyplot as plt

# Constants
g = 9.81        # Acceleration due to gravity (m/s^2)
X = 1000        # Horizontal distance to target (m)
Y = 300         # Vertical height of target (m)
u_given = 150   # Given launch speed (m/s)

# Function to calculate the minimum launch speed required to hit the target
def calculate_minimum_launch_speed(X, Y):
    u_min = np.sqrt(g * (Y + np.sqrt(X ** 2 + Y ** 2)))
    return u_min

# Function to calculate the two possible launch angles for a given speed to hit the target
def calculate_launch_angles(u, X, Y):
    discriminant = u ** 4 - g * (g * X ** 2 + 2 * u ** 2 * Y)
    if discriminant < 0:
        raise ValueError("No real solutions for the given parameters.")
    theta_high = np.arctan((u ** 2 + np.sqrt(discriminant)) / (g * X))  # Higher angle
    theta_low = np.arctan((u ** 2 - np.sqrt(discriminant)) / (g * X))   # Lower angle
    return theta_high, theta_low

# Function to calculate the launch angle corresponding to the minimum speed
def calculate_min_speed_angle(X, Y):
    theta_min = np.arctan((Y + np.sqrt(X ** 2 + Y ** 2)) / X)
    return theta_min

# Function to generate the trajectory data points for a given angle and speed
def generate_trajectory(theta, v0, X_target, Y_target, num_points=500):
    t_flight = 2 * v0 * np.sin(theta) / g  # Total flight time
    t = np.linspace(0, t_flight, num_points)  # Time array
    x = v0 * np.cos(theta) * t  # Horizontal distance as a function of time
    y = v0 * np.sin(theta) * t - 0.5 * g * t ** 2  # Vertical distance as a function of time
    
    # Only keep the points where the projectile is before the target
    mask = x <= X_target
    x = x[mask]
    y = y[mask]
    
    # Ensure the last point exactly matches the target
    if len(x) == 0 or len(y) == 0:
        raise ValueError("No trajectory data points before reaching the target.")
    x[-1], y[-1] = X_target, Y_target
    
    return x, y

# Calculate the minimum launch speed required to reach the target
u_min = calculate_minimum_launch_speed(X, Y)

# Calculate the two possible launch angles for the given speed
theta_high, theta_low = calculate_launch_angles(u_given, X, Y)

# Calculate the launch angle for the minimum speed
theta_min = calculate_min_speed_angle(X, Y)

# Generate the trajectory for the low angle with the given speed
x_low, y_low = generate_trajectory(theta_low, u_given, X, Y)

# Generate the trajectory for the high angle with the given speed
x_high, y_high = generate_trajectory(theta_high, u_given, X, Y)

# Generate the trajectory for the minimum launch speed
x_min, y_min = generate_trajectory(theta_min, u_min, X, Y)

# Plot the trajectories
plt.figure(figsize=(10, 6))
plt.plot(x_low, y_low, label='Low ball', color='orange')  # Low angle trajectory
plt.plot(x_high, y_high, label='High ball', color='blue')  # High angle trajectory
plt.plot(x_min, y_min, label='Min u', color='gray')  # Minimum speed trajectory
plt.scatter([X], [Y], color='yellow', label='Target (X,Y)', zorder=5)  # Mark the target position
plt.xlabel('x / m')  # Label for the x-axis
plt.ylabel('y above launch height / m')  # Label for the y-axis
plt.title('Projectile to hit (X,Y)')  # Title of the plot
plt.legend()  # Display the legend
plt.grid()  # Display a grid

# Show the plot
plt.show()
