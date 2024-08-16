// src/Task-7.js
import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';

const Task7 = () => {
    // State variables for projectile motion
    const [theta, setTheta] = useState(70.5); // Launch angle in degrees
    const [initialSpeed, setInitialSpeed] = useState(10); // Initial speed in m/s
    const [gravity, setGravity] = useState(10); // Gravity in m/s²

    // State variables for number of lines and steps
    const [numTrajectories, setNumTrajectories] = useState(5); // Number of trajectories
    const [angleStep, setAngleStep] = useState(1); // Angle step in degrees
    const [numRangeTrajectories, setNumRangeTrajectories] = useState(5); // Number of range trajectories
    const [rangeAngleStep, setRangeAngleStep] = useState(1); // Angle step for range plot in degrees

    const projectileMotion = (theta) => {
        const thetaRad = theta * (Math.PI / 180); // Convert to radians
        const T = 4 * initialSpeed * Math.sin(thetaRad) / gravity;
        const t = Array.from({ length: 1000 }, (_, i) => (i / 999) * T);
        const x = t.map(ti => initialSpeed * Math.cos(thetaRad) * ti);
        const y = t.map(ti => initialSpeed * Math.sin(thetaRad) * ti - 0.5 * gravity * ti ** 2);

        const sinTheta = Math.sin(thetaRad);
        const t1 = (3 * initialSpeed * sinTheta) / (2 * gravity);
        const t2 = (3 * initialSpeed * sinTheta) / (2 * gravity) - Math.sqrt((initialSpeed * sinTheta) ** 2 - (8 * gravity * 0) / 9) / gravity;

        const xMax = initialSpeed * Math.cos(thetaRad) * t1;
        const yMax = initialSpeed * Math.sin(thetaRad) * t1 - 0.5 * gravity * t1 ** 2;

        const xMin = initialSpeed * Math.cos(thetaRad) * t2;
        const yMin = initialSpeed * Math.sin(thetaRad) * t2 - 0.5 * gravity * t2 ** 2;

        return { t, x, y, xMax, yMax, xMin, yMin };
    };

    const [plotData, setPlotData] = useState([]);
    const [rangePlotData, setRangePlotData] = useState([]);

    useEffect(() => {
        // Trajectory Plot Data
        const angles = Array.from({ length: numTrajectories }, (_, i) => theta + i * angleStep);
        const trajectories = angles.map(angle => projectileMotion(angle));

        const trajectoryData = trajectories.map(({ x, y }, index) => ({
            x: x,
            y: y,
            type: 'scatter',
            mode: 'lines',
            line: { width: 2 },
            name: `Projectile Path (θ=${angles[index].toFixed(1)}°)`,
        }));

        const maxPoints = {
            x: trajectories.map(({ xMax }) => xMax),
            y: trajectories.map(({ yMax }) => yMax),
            type: 'scatter',
            mode: 'markers',
            marker: { color: 'blue', size: 6, symbol: 'x' },
            name: 'Maxima',
        };

        const minPoints = {
            x: trajectories.map(({ xMin }) => xMin),
            y: trajectories.map(({ yMin }) => yMin),
            type: 'scatter',
            mode: 'markers',
            marker: { color: 'red', size: 6, symbol: 'x' },
            name: 'Minima',
        };

        setPlotData([...trajectoryData, maxPoints, minPoints]);

        // Range Plot Data
        const rangeAngles = Array.from({ length: numRangeTrajectories }, (_, i) => theta + i * rangeAngleStep);
        const rangeData = rangeAngles.map(angle => {
            const { t, x, y } = projectileMotion(angle);
            const rangeValues = x.map((xi, i) => Math.sqrt(xi ** 2 + y[i] ** 2));
            return {
                x: t,
                y: rangeValues,
                type: 'scatter',
                mode: 'lines',
                name: `Projectile Range (θ=${angle.toFixed(1)}°)`,
                line: { width: 2 }
            };
        });

        setRangePlotData(rangeData);

    }, [theta, initialSpeed, gravity, numTrajectories, angleStep, numRangeTrajectories, rangeAngleStep]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '20px' }}>
            <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>Task 7 - Projectile Motion with Maxima and Minima</h1>
            <div style={{ display: 'flex', marginBottom: '20px' }}>
                <div style={{ flex: 1, marginRight: '20px' }}>
                    <h2>Trajectory Plot</h2>
                    <Plot
                        data={plotData}
                        layout={{
                            title: 'Projectile Motion with Maxima and Minima',
                            xaxis: { title: 'Distance (m)' },
                            yaxis: { title: 'Height (m)' },
                        }}
                        style={{ width: '100%', height: '500px' }}
                    />
                    <div style={{ marginTop: '10px' }}>
                        <label>
                            Number of Trajectories:
                            <input
                                type="number"
                                min="1"
                                value={numTrajectories}
                                onChange={(e) => setNumTrajectories(parseInt(e.target.value))}
                                style={{ width: '100px', marginLeft: '10px' }}
                            />
                        </label>
                        <label style={{ marginLeft: '20px' }}>
                            Angle Step (degrees):
                            <input
                                type="number"
                                min="0.1"
                                step="0.1"
                                value={angleStep}
                                onChange={(e) => setAngleStep(parseFloat(e.target.value))}
                                style={{ width: '100px', marginLeft: '10px' }}
                            />
                        </label>
                    </div>
                </div>

                <div style={{ flex: 1 }}>
                    <h2>Range Plot</h2>
                    <Plot
                        data={rangePlotData}
                        layout={{
                            title: 'Range Over Time',
                            xaxis: { title: 'Time (s)' },
                            yaxis: { title: 'Range (m)' },
                        }}
                        style={{ width: '100%', height: '500px' }}
                    />
                    <div style={{ marginTop: '10px' }}>
                        <label>
                            Number of Range Trajectories:
                            <input
                                type="number"
                                min="1"
                                value={numRangeTrajectories}
                                onChange={(e) => setNumRangeTrajectories(parseInt(e.target.value))}
                                style={{ width: '100px', marginLeft: '10px' }}
                            />
                        </label>
                        <label style={{ marginLeft: '20px' }}>
                            Angle Step for Range (degrees):
                            <input
                                type="number"
                                min="0.1"
                                step="0.1"
                                value={rangeAngleStep}
                                onChange={(e) => setRangeAngleStep(parseFloat(e.target.value))}
                                style={{ width: '100px', marginLeft: '10px' }}
                            />
                        </label>
                    </div>
                </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
                <h2>Trajectory Plot Settings</h2>
                <label>
                    Launch Angle (degrees):
                    <input
                        type="range"
                        min="0"
                        max="90"
                        step="0.01"
                        value={theta}
                        onChange={(e) => setTheta(parseFloat(e.target.value))}
                    />
                    <input
                        type="number"
                        min="0"
                        max="90"
                        step="0.01"
                        value={theta.toFixed(2)}
                        onChange={(e) => setTheta(parseFloat(e.target.value))}
                        style={{ width: '100px', marginLeft: '10px' }}
                    />
                </label>
                <label style={{ marginLeft: '20px' }}>
                    Initial Speed (m/s):
                    <input
                        type="range"
                        min="0"
                        max="1000"
                        step="0.01"
                        value={initialSpeed}
                        onChange={(e) => setInitialSpeed(parseFloat(e.target.value))}
                    />
                    <input
                        type="number"
                        min="0"
                        max="1000"
                        step="0.01"
                        value={initialSpeed.toFixed(2)}
                        onChange={(e) => setInitialSpeed(parseFloat(e.target.value))}
                        style={{ width: '100px', marginLeft: '10px' }}
                    />
                </label>
                <label style={{ marginLeft: '20px' }}>
                    Gravity (m/s²):
                    <input
                        type="range"
                        min="1"
                        max="20"
                        step="0.01"
                        value={gravity}
                        onChange={(e) => setGravity(parseFloat(e.target.value))}
                    />
                    <input
                        type="number"
                        min="1"
                        max="20"
                        step="0.01"
                        value={gravity.toFixed(2)}
                        onChange={(e) => setGravity(parseFloat(e.target.value))}
                        style={{ width: '100px', marginLeft: '10px' }}
                    />
                </label>
            </div>
        </div>
    );
};

export default Task7;
