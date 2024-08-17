# Required libraries
import numpy as np
import matplotlib.pyplot as plt

# Function to compute the z function used in trajectory length calculation
def z_func(z):
    return 0.5 * np.log(np.abs(np.sqrt(1 + z ** 2) + z)) + 0.5 * z * np.sqrt(1 + z ** 2)

# Function to calculate various properties of the projectile motion
def pcalc(theta, u, g, h, N):
    p = {}
    theta_rad = np.radians(theta)  # Convert angle to radians

    # Calculate range of the projectile
    p['R'] = ((u ** 2) / g) * (np.sin(theta_rad) * np.cos(theta_rad) + np.cos(theta_rad) * np.sqrt(np.sin(theta_rad) ** 2 + 2 * g * h / (u ** 2)))

    # Compute the trajectory points
    p['x'] = np.linspace(0, p['R'], N)  # Horizontal distances
    p['t'] = p['x'] / (u * np.cos(theta_rad))  # Time of flight for each horizontal distance
    p['T'] = p['R'] / (u * np.cos(theta_rad))  # Total time of flight
    p['y'] = h + p['x'] * np.tan(theta_rad) - (g / (2 * u ** 2)) * (p['x'] ** 2) * (1 + np.tan(theta_rad) ** 2)  # Vertical distance
    
    # Compute apogee and velocity components
    p['ta'] = u * np.sin(theta_rad) / g
    p['xa'] = (u ** 2) * np.sin(2 * theta_rad) / (2 * g)
    p['ya'] = h + ((u ** 2) / (2 * g)) * np.sin(theta_rad) ** 2
    p['vx'] = u * np.cos(theta_rad) * np.ones(N)  # Horizontal velocity
    p['vy'] = u * np.sin(theta_rad) - g * p['t']  # Vertical velocity
    p['v'] = np.sqrt(p['vx'] ** 2 + p['vy'] ** 2)  # Total velocity
    p['phi'] = np.arctan2(p['vy'], p['vx'])  # Angle of velocity vector

    # Compute the analytical length of the trajectory
    a = (u ** 2) / (g * (1 + (np.tan(theta_rad)) ** 2))
    b = np.tan(theta_rad)
    c = np.tan(theta_rad) - g * p['R'] * (1 + (np.tan(theta_rad)) ** 2) / (u ** 2)
    p['s'] = a * (z_func(b) - z_func(c))

    # Compute the numerical length of the trajectory using numerical integration
    dx = np.diff(p['x'])
    dy = np.diff(p['y'])
    p['s_numeric'] = np.sum(np.sqrt(dx ** 2 + dy ** 2))

    # Compute properties for the maximum range trajectory
    p['theta_m'] = np.degrees(np.arcsin(np.sqrt(1 / (2 + 2 * g * h / (u ** 2)))))  # Optimal launch angle for maximum range
    p['T_m'] = (u / g) * np.sqrt(2 + 2 * g * h / (u ** 2))  # Total time of flight for maximum range
    p['R_m'] = ((u ** 2) / g) * np.sqrt(1 + 2 * g * h / (u ** 2))  # Maximum range

    return p

# Parameters for the projectile
theta = 60  # Given launch angle (degrees)
u = 10      # Initial launch speed (m/s)
g = 9.81    # Acceleration due to gravity (m/s^2)
h = 2       # Initial height (m)
N = 500     # Number of points in trajectory calculation

# Calculate properties for the given and optimal trajectories
p_given = pcalc(theta, u, g, h, N)
theta_optimal = np.degrees(np.arcsin(np.sqrt(1 / (2 + 2 * g * h / (u ** 2)))))  # Optimal angle for maximum range
p_optimal = pcalc(theta_optimal, u, g, h, N)

# Plotting the trajectories
plt.figure(figsize=(12, 6))
plt.plot(p_given['x'], p_given['y'], label=f'Trajectory: θ={theta}°')
plt.plot(p_optimal['x'], p_optimal['y'], label=f'Max Range Trajectory: θ={theta_optimal:.2f}°', linestyle='--')
plt.xlabel('Horizontal Distance (m)')
plt.ylabel('Vertical Distance (m)')
plt.title('Projectile Trajectories')
plt.legend()
plt.grid(True)
plt.show()

# Output the calculated properties
print(f"Given Trajectory:")
print(f"  Range: {p_given['R']:.2f} m")
print(f"  Time of flight: {p_given['T']:.2f} s")
print(f"  Apogee: ({p_given['xa']:.2f}, {p_given['ya']:.2f}) m")
print(f"  Length of trajectory (analytical): {p_given['s']:.2f} m")
print(f"  Length of trajectory (numeric): {p_given['s_numeric']:.2f} m")

print(f"Optimal Trajectory for Max Range:")
print(f"  Range: {p_optimal['R']:.2f} m")
print(f"  Time of flight: {p_optimal['T']:.2f} s")
print(f"  Apogee: ({p_optimal['xa']:.2f}, {p_optimal['ya']:.2f}) m")
print(f"  Length of trajectory (analytical): {p_optimal['s']:.2f} m")
print(f"  Length of trajectory (numeric): {p_optimal['s_numeric']:.2f} m")
