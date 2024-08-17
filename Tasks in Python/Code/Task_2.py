# Required libraries
import numpy as np
import matplotlib.pyplot as plt

# Initial parameters
u = 50          # Initial speed in m/s
theta = 45      # Launch angle in degrees
h = 10          # Initial height of the projectile in meters
g = 9.81        # Acceleration due to gravity in m/s^2

# Convert the launch angle to radians
theta_rad = np.radians(theta)

# Calculate the horizontal distance to the apogee (x-coordinate where the maximum height is reached)
x_a = (u**2 / g) * np.sin(theta_rad) * np.cos(theta_rad)

# Calculate the maximum height (y-coordinate at the apogee)
y_a = h + (u**2 / (2 * g)) * np.sin(theta_rad)**2

# Calculate the range (horizontal distance) of the projectile
R = (u**2 / g) * (np.sin(theta_rad) * np.cos(theta_rad) + np.cos(theta_rad) * np.sqrt(np.sin(theta_rad)**2 + (2 * g * h) / u**2))

# Generate x-coordinates for plotting the trajectory
x = np.linspace(0, R, 500)

# Calculate the corresponding y-coordinates using the projectile motion equation
y = h + x * np.tan(theta_rad) - (g / (2 * u**2 * np.cos(theta_rad)**2)) * x**2

# Create a plot to visualize the projectile trajectory
plt.figure(figsize=(10, 5))
plt.plot(x, y, label='Projectile Trajectory')  # Plot the trajectory
plt.scatter([x_a], [y_a], color='red', marker='x', s=100, label='Apogee')  # Mark the apogee with a cross
plt.title('Projectile Trajectory')  # Title of the plot
plt.xlabel('Horizontal Distance (m)')  # Label for the x-axis
plt.ylabel('Vertical Distance (m)')    # Label for the y-axis
plt.legend()  # Display the legend
plt.grid(True)  # Display a grid

# Show the plot
plt.show()
