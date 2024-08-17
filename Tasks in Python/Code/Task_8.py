# Required libraries
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation, FFMpegWriter

# Constants
g = 9.81       # Acceleration due to gravity (m/s^2)
dt = 0.01      # Time step for simulation (s)
N_bounces = 5  # Number of bounces
e = 0.8        # Coefficient of restitution (elasticity)

# Initial conditions
x0 = 0         # Initial horizontal position (m)
y0 = 10        # Initial vertical position (m)
vx0 = 2        # Initial horizontal velocity (m/s)
vy0 = 10       # Initial vertical velocity (m/s)

# Lists to store the trajectory
x = [x0]
y = [y0]

# Current state
x_curr = x0
y_curr = y0
vx_curr = vx0
vy_curr = vy0
bounces = 0

# Simulation loop
while bounces < N_bounces:
    # Update positions and velocities
    x_next = x_curr + vx_curr * dt
    y_next = y_curr + vy_curr * dt - 0.5 * g * dt**2
    vy_next = vy_curr - g * dt

    # Handle bounce with ground
    if y_next < 0:
        y_next = 0
        vy_next = -e * vy_curr  # Reverse and reduce vertical velocity
        bounces += 1  # Increment bounce counter

    # Append new values to trajectory lists
    x.append(x_next)
    y.append(y_next)
    
    # Update current state
    x_curr = x_next
    y_curr = y_next
    vy_curr = vy_next

# Convert lists to numpy arrays for plotting
x = np.array(x)
y = np.array(y)

# Set up the plot
fig, ax = plt.subplots()
ax.set_xlim(0, max(x))  # Set x-axis limits
ax.set_ylim(0, max(y) + 1)  # Set y-axis limits with a bit of extra space
line, = ax.plot([], [], 'b-', label='Projectile trajectory')  # Line plot for trajectory
point, = ax.plot([], [], 'ro')  # Point plot for the current position
ax.set_title('Projectile Trajectory with Bounces')
ax.set_xlabel('Horizontal Distance (m)')
ax.set_ylabel('Vertical Distance (m)')
ax.legend()
ax.grid()

# Initialization function for animation
def init():
    line.set_data([], [])
    point.set_data([], [])
    return line, point

# Animation function
def animate(i):
    line.set_data(x[:i+1], y[:i+1])  # Update trajectory line
    point.set_data([x[i]], [y[i]])    # Update current position point
    return line, point

# Create the animation
ani = FuncAnimation(fig, animate, init_func=init, frames=len(x), interval=20, blit=True)

# Save the animation to a video file
writer = FFMpegWriter(fps=30, metadata={'artist': 'Devansh Srivastava'}, bitrate=1800)
ani.save("Task_8.mp4", writer=writer)

# Show the plot
plt.show()
