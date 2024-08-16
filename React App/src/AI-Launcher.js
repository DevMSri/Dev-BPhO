// src/AI-Launcher.js
import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { solarizedlight } from 'react-syntax-highlighter/dist/esm/styles/prism';

// Example Python code snippet
const pythonCode = `
import numpy as np
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D

# Define parameters for additional plots
grid_size = 20

# 3D Plot of Hit Probability vs Target Speed and Target Angle
target_speeds = np.linspace(5, 20, grid_size)
target_angles = np.linspace(15, 75, grid_size)
target_speeds_grid, target_angles_grid = np.meshgrid(target_speeds, target_angles)
hit_probabilities = np.zeros(target_speeds_grid.shape)

# Calculate hit probabilities
for i in range(grid_size):
    for j in range(grid_size):
        data = np.array([[target_speeds_grid[i, j], target_angles_grid[i, j], new_launcher_speed, new_launcher_angle]])
        data_scaled = scaler.transform(data)
        hit_probabilities[i, j] = model.predict(data_scaled)[0][0]

fig = plt.figure(figsize=(12, 8))
ax = fig.add_subplot(111, projection='3d')
ax.plot_surface(target_speeds_grid, target_angles_grid, hit_probabilities, cmap='viridis')
ax.set_xlabel('Target Speed (m/s)')
ax.set_ylabel('Target Angle (degrees)')
ax.set_zlabel('Hit Probability')
ax.set_title('Hit Probability vs Target Speed and Target Angle')
plt.show()

# 3D Plot of Hit Probability vs Launcher Speed and Launcher Angle
launcher_speeds = np.linspace(10, 30, grid_size)
launcher_angles = np.linspace(15, 75, grid_size)
launcher_speeds_grid, launcher_angles_grid = np.meshgrid(launcher_speeds, launcher_angles)
hit_probabilities = np.zeros(launcher_speeds_grid.shape)

# Calculate hit probabilities
for i in range(grid_size):
    for j in range(grid_size):
        data = np.array([[new_target_speed, new_target_angle, launcher_speeds_grid[i, j], launcher_angles_grid[i, j]]])
        data_scaled = scaler.transform(data)
        hit_probabilities[i, j] = model.predict(data_scaled)[0][0]

fig = plt.figure(figsize=(12, 8))
ax = fig.add_subplot(111, projection='3d')
ax.plot_surface(launcher_speeds_grid, launcher_angles_grid, hit_probabilities, cmap='viridis')
ax.set_xlabel('Launcher Speed (m/s)')
ax.set_ylabel('Launcher Angle (degrees)')
ax.set_zlabel('Hit Probability')
ax.set_title('Hit Probability vs Launcher Speed and Launcher Angle')
plt.show()

# 3D Plot of Hit Probability vs Target Speed and Launcher Angle
target_speeds = np.linspace(5, 20, grid_size)
launcher_angles = np.linspace(15, 75, grid_size)
target_speeds_grid, launcher_angles_grid = np.meshgrid(target_speeds, launcher_angles)
hit_probabilities = np.zeros(target_speeds_grid.shape)

# Calculate hit probabilities
for i in range(grid_size):
    for j in range(grid_size):
        data = np.array([[target_speeds_grid[i, j], new_target_angle, new_launcher_speed, launcher_angles_grid[i, j]]])
        data_scaled = scaler.transform(data)
        hit_probabilities[i, j] = model.predict(data_scaled)[0][0]

fig = plt.figure(figsize=(12, 8))
ax = fig.add_subplot(111, projection='3d')
ax.plot_surface(target_speeds_grid, launcher_angles_grid, hit_probabilities, cmap='viridis')
ax.set_xlabel('Target Speed (m/s)')
ax.set_ylabel('Launcher Angle (degrees)')
ax.set_zlabel('Hit Probability')
ax.set_title('Hit Probability vs Target Speed and Launcher Angle')
plt.show()

import numpy as np
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D

# Define simulation parameters
time_steps = np.linspace(0, 10, 500)
new_target_speed = 12  # Example target speed
new_target_angle = 30  # Example target angle
new_launcher_speed = 20  # Example launcher speed
new_launcher_angle = 45  # Example launcher angle
g = 9.81  # Gravity in m/s^2

# Calculate positions for target and launcher over time
target_positions_x = new_target_speed * np.cos(np.radians(new_target_angle)) * time_steps
target_positions_y = new_target_speed * np.sin(np.radians(new_target_angle)) * time_steps - 0.5 * g * time_steps ** 2
target_positions_z = np.zeros_like(time_steps)

launcher_positions_x = new_launcher_speed * np.cos(np.radians(new_launcher_angle)) * time_steps
launcher_positions_y = new_launcher_speed * np.sin(np.radians(new_launcher_angle)) * time_steps - 0.5 * g * time_steps ** 2
launcher_positions_z = np.zeros_like(time_steps)

# Calculate distance between target and launcher over time
distances = np.sqrt((target_positions_x - launcher_positions_x) ** 2 +
                    (target_positions_y - launcher_positions_y) ** 2)

# Plot 1: Target and Launcher Trajectories vs Time
fig = plt.figure(figsize=(12, 8))
ax = fig.add_subplot(131, projection='3d')
ax.plot(time_steps, target_positions_x, target_positions_y, label='Target Trajectory')
ax.plot(time_steps, launcher_positions_x, launcher_positions_y, label='Launcher Trajectory')
ax.set_xlabel('Time (s)')
ax.set_ylabel('X Position (m)')
ax.set_zlabel('Y Position (m)')
ax.set_title('Target and Launcher Trajectories vs Time')
ax.legend()

# Plot 2: Launcher Position vs Target Position and Time
fig.add_subplot(132, projection='3d')
ax = fig.add_subplot(132, projection='3d')
ax.plot(target_positions_x, target_positions_y, time_steps, label='Target Trajectory')
ax.plot(launcher_positions_x, launcher_positions_y, time_steps, label='Launcher Trajectory')
ax.set_xlabel('X Position (m)')
ax.set_ylabel('Y Position (m)')
ax.set_zlabel('Time (s)')
ax.set_title('Target and Launcher Positions vs Time')
ax.legend()

# Plot 3: Distance Between Target and Launcher vs Time
fig.add_subplot(133, projection='3d')
ax = fig.add_subplot(133, projection='3d')
ax.plot(time_steps, distances, np.zeros_like(time_steps), label='Distance Over Time')
ax.set_xlabel('Time (s)')
ax.set_ylabel('Distance (m)')
ax.set_zlabel('Zero Plane')
ax.set_title('Distance Between Target and Launcher vs Time')
ax.legend()

plt.tight_layout()
plt.show()
`;

const AI_Launcher = () => {
    return (
        <div>
            {/* Navigation Bar */}
            <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, backgroundColor: '#333', padding: '10px', color: '#fff', zIndex: 1000 }}>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', justifyContent: 'space-around' }}>
                    <li><a href="/" style={{ color: '#fff', textDecoration: 'none' }}>Home</a></li>
                    <li><a href="/ai-launcher" style={{ color: '#fff', textDecoration: 'none' }}>AI Launcher</a></li>
                    <li><a href="/other-page" style={{ color: '#fff', textDecoration: 'none' }}>Other Page</a></li>
                </ul>
            </nav>

            {/* Main Content */}
            <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '5px', maxWidth: '900px', marginTop: '3000px', backgroundColor: '#f5f5f5' }}>
                <h2>Python Code</h2>
                <SyntaxHighlighter language="python" style={solarizedlight}>
                    {pythonCode}
                </SyntaxHighlighter>
            </div>
        </div>
    );
};

export default AI_Launcher;
