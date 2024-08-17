# Required libraries
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.widgets import Slider

# Function to calculate the projectile motion trajectory
def projectile_motion(theta, u, g, h, dt=0.01):
    theta_rad = np.deg2rad(theta)  # Convert angle to radians
    ux = u * np.cos(theta_rad)  # Initial horizontal velocity component
    uy = u * np.sin(theta_rad)  # Initial vertical velocity component
    x = [0.0]  # List to store x-coordinates (horizontal distance)
    y = [h]    # List to store y-coordinates (vertical distance)
    t = [0.0]  # List to store time steps
    vx = ux    # Horizontal velocity (constant in the absence of air resistance)
    vy = uy    # Vertical velocity (changes due to gravity)

    # Loop to calculate projectile motion until the projectile hits the ground
    while y[-1] >= 0:
        vy -= g * dt  # Update vertical velocity due to gravity
        x.append(x[-1] + vx * dt)  # Update horizontal position
        y.append(y[-1] + vy * dt)  # Update vertical position
        t.append(t[-1] + dt)  # Update time

    # Convert lists to NumPy arrays and return x and y coordinates
    return np.array(x), np.array(y)

# Initial parameters
initial_theta = 45.0  # Initial launch angle in degrees
initial_u = 10.0      # Initial launch speed in m/s
g = 9.81              # Acceleration due to gravity in m/s^2
h = 2.0               # Initial height of the projectile in meters
dt = 0.01             # Time step for the simulation

# Calculate the trajectory for the initial parameters
x, y = projectile_motion(initial_theta, initial_u, g, h, dt)

# Create a plot to visualize the projectile motion
fig, ax = plt.subplots()
plt.subplots_adjust(bottom=0.25)  # Adjust the plot to make space for sliders
trajectory, = ax.plot(x, y, label='Projectile Path')  # Plot the trajectory
ax.set_xlabel('Horizontal Distance (m)')  # Label for the x-axis
ax.set_ylabel('Vertical Distance (m)')    # Label for the y-axis
ax.set_title('Projectile Motion')         # Title of the plot
plt.legend()  # Display the legend
plt.grid(True)  # Display a grid

# Show the plot
plt.show()
