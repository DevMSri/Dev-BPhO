# Required libraries
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation, FFMpegWriter

# Constants
g = 9.81       # Acceleration due to gravity (m/s^2)
dt = 0.01      # Time step for simulation (s)
N_bounces = 10 # Number of bounces
e = 0.8        # Coefficient of restitution (elasticity)
c = 0.1        # Drag coefficient

# Initial conditions
x0 = 0         # Initial horizontal position (m)
y0 = 10        # Initial vertical position (m)
vx0 = 2        # Initial horizontal velocity (m/s)
vy0 = 10       # Initial vertical velocity (m/s)

# Lists to store the trajectories
x_drag_free = [x0]  # Trajectory without drag
y_drag_free = [y0]  # Trajectory without drag
x_drag = [x0]       # Trajectory with drag
y_drag = [y0]       # Trajectory with drag

# Current state for no drag trajectory
x_curr_df = x0
y_curr_df = y0
vx_curr_df = vx0
vy_curr_df = vy0

# Current state for drag trajectory
x_curr_drag = x0
y_curr_drag = y0
vx_curr_drag = vx0
vy_curr_drag = vy0
bounces_df = 0

# Simulation loop for drag-free trajectory
while bounces_df < N_bounces:
    # Calculate next positions and velocities
    x_next_df = x_curr_df + vx_curr_df * dt
    y_next_df = y_curr_df + vy_curr_df * dt - 0.5 * g * dt**2
    vy_next_df = vy_curr_df - g * dt

    # Handle bounce with ground
    if y_next_df < 0:
        y_next_df = 0
        vy_next_df = -e * vy_curr_df  # Reverse and reduce vertical velocity
        bounces_df += 1  # Increment bounce counter

    # Append new values to trajectory lists
    x_drag_free.append(x_next_df)
    y_drag_free.append(y_next_df)
    
    # Update current state
    x_curr_df = x_next_df
    y_curr_df = y_next_df
    vy_curr_df = vy_next_df

# Reset bounce counter for drag trajectory
bounces_drag = 0

# Simulation loop for trajectory with drag
while bounces_drag < N_bounces:
    # Calculate velocity magnitude and drag forces
    v_curr_drag = np.sqrt(vx_curr_drag**2 + vy_curr_drag**2)
    drag_fx = -c * v_curr_drag * vx_curr_drag
    drag_fy = -c * v_curr_drag * vy_curr_drag
    
    # Calculate next positions and velocities
    x_next_drag = x_curr_drag + vx_curr_drag * dt + 0.5 * drag_fx * dt**2
    y_next_drag = y_curr_drag + vy_curr_drag * dt - 0.5 * g * dt**2 + 0.5 * drag_fy * dt**2
    vx_next_drag = vx_curr_drag + drag_fx * dt
    vy_next_drag = vy_curr_drag - g * dt + drag_fy * dt

    # Handle bounce with ground
    if y_next_drag < 0:
        y_next_drag = 0
        vy_next_drag = -e * vy_curr_drag  # Reverse and reduce vertical velocity
        bounces_drag += 1  # Increment bounce counter

    # Append new values to trajectory lists
    x_drag.append(x_next_drag)
    y_drag.append(y_next_drag)
    
    # Update current state
    x_curr_drag = x_next_drag
    y_curr_drag = y_next_drag
    vx_curr_drag = vx_next_drag
    vy_curr_drag = vy_next_drag

# Convert lists to numpy arrays for plotting
x_drag_free = np.array(x_drag_free)
y_drag_free = np.array(y_drag_free)
x_drag = np.array(x_drag)
y_drag = np.array(y_drag)

# Set up the plot
fig, ax = plt.subplots()
ax.set_xlim(0, max(max(x_drag_free), max(x_drag)))  # Set x-axis limits
ax.set_ylim(0, max(max(y_drag_free), max(y_drag)) + 1)  # Set y-axis limits with a bit of extra space
line_df, = ax.plot([], [], 'b-', label='Drag-Free Trajectory')  # Line plot for drag-free trajectory
point_df, = ax.plot([], [], 'bo')  # Point plot for drag-free current position
line_drag, = ax.plot([], [], 'r-', label='Trajectory with Drag')  # Line plot for trajectory with drag
point_drag, = ax.plot([], [], 'ro')  # Point plot for drag trajectory current position
ax.set_title('Projectile Trajectory Comparison: Drag-Free vs. With Drag')
ax.set_xlabel('Horizontal Distance (m)')
ax.set_ylabel('Vertical Distance (m)')
ax.legend()
ax.grid()

# Initialization function for animation
def init():
    line_df.set_data([], [])
    point_df.set_data([], [])
    line_drag.set_data([], [])
    point_drag.set_data([], [])
    return line_df, point_df, line_drag, point_drag

# Animation function
def animate(i):
    if i < len(x_drag_free):  # Ensure index is within bounds
        line_df.set_data(x_drag_free[:i+1], y_drag_free[:i+1])
        point_df.set_data([x_drag_free[i]], [y_drag_free[i]])
    if i < len(x_drag):  # Ensure index is within bounds
        line_drag.set_data(x_drag[:i+1], y_drag[:i+1])
        point_drag.set_data([x_drag[i]], [y_drag[i]])
    return line_df, point_df, line_drag, point_drag

# Create the animation
ani = FuncAnimation(fig, animate, init_func=init, frames=len(x_drag_free), interval=20, blit=True)

# Save the animation to a video file
writer = FFMpegWriter(fps=30, metadata={'artist': 'Devansh Srivastava'}, bitrate=1800)
ani.save("Task_9.mp4", writer=writer)

# Show the plot
plt.show()
