// src/Task-4.js
import React, { useState, useCallback, useEffect } from 'react';
import Plot from 'react-plotly.js';

const g = 9.81; // Default gravity

const optimalAngle = (u, h, g) => {
    return Math.asin(1 / Math.sqrt(2 + 2 * g * h / (u ** 2))) * (180 / Math.PI); // Convert to degrees
};

const trajectory = (u, theta, h, g, numPoints = 500) => {
    const thetaRad = theta * (Math.PI / 180); // Convert to radians
    const tFlight = (u * Math.sin(thetaRad) + Math.sqrt((u * Math.sin(thetaRad)) ** 2 + 2 * g * h)) / g;
    const t = Array.from({ length: numPoints }, (_, i) => (i / (numPoints - 1)) * tFlight);
    const x = t.map(ti => u * Math.cos(thetaRad) * ti);
    const y = t.map(ti => h + u * Math.sin(thetaRad) * ti - 0.5 * g * ti ** 2);
    return { x, y };
};

const plotTrajectories = (u, h, g, givenTheta) => {
    const thetaOptimal = optimalAngle(u, h, g);
    const { x: xGiven, y: yGiven } = trajectory(u, givenTheta, h, g);
    const { x: xOptimal, y: yOptimal } = trajectory(u, thetaOptimal, h, g);
    return [
        {
            x: xGiven,
            y: yGiven,
            type: 'scatter',
            mode: 'lines',
            line: { color: 'blue' },
            name: `Given Angle: ${givenTheta.toFixed(2)} degrees`,
        },
        {
            x: xOptimal,
            y: yOptimal,
            type: 'scatter',
            mode: 'lines',
            line: { color: 'red', dash: 'dash' },
            name: `Optimal Angle: ${thetaOptimal.toFixed(2)} degrees`,
        }
    ];
};

const Task4 = () => {
    const [angle, setAngle] = useState(60);
    const [speed, setSpeed] = useState(10);
    const [height, setHeight] = useState(2);
    const [gravity, setGravity] = useState(9.81);

    const calculateData = useCallback(() => {
        return plotTrajectories(speed, height, gravity, angle);
    }, [angle, speed, height, gravity]);

    const data = calculateData();

    return (
        <div>
            <h1>Projectile Trajectories</h1>
            <Plot
                data={data}
                layout={{
                    title: 'Projectile Trajectories',
                    xaxis: { title: 'Horizontal Distance (m)' },
                    yaxis: { title: 'Vertical Distance (m)' },
                }}
                style={{ width: '100%', height: '500px' }}
            />
            <div>
                <label>
                    Angle (degrees):
                    <input
                        type="range"
                        min="-90"
                        max="90"
                        step="0.01"
                        value={angle}
                        onChange={(e) => setAngle(parseFloat(e.target.value))}
                    />
                    <input
                        type="number"
                        min="-90"
                        max="90"
                        step="0.01"
                        value={angle.toFixed(2)}
                        onChange={(e) => setAngle(parseFloat(e.target.value))}
                        style={{ width: '100px', marginLeft: '10px' }}
                    />
                </label>
            </div>
            <div>
                <label>
                    Initial Speed (m/s):
                    <input
                        type="range"
                        min="0"
                        max="1000"
                        step="0.01"
                        value={speed}
                        onChange={(e) => setSpeed(parseFloat(e.target.value))}
                    />
                    <input
                        type="number"
                        min="0"
                        max="1000"
                        step="0.01"
                        value={speed.toFixed(2)}
                        onChange={(e) => setSpeed(parseFloat(e.target.value))}
                        style={{ width: '100px', marginLeft: '10px' }}
                    />
                </label>
            </div>
            <div>
                <label>
                    Initial Height (m):
                    <input
                        type="range"
                        min="0"
                        max="1000"
                        step="0.01"
                        value={height}
                        onChange={(e) => setHeight(parseFloat(e.target.value))}
                    />
                    <input
                        type="number"
                        min="0"
                        max="1000"
                        step="0.01"
                        value={height.toFixed(2)}
                        onChange={(e) => setHeight(parseFloat(e.target.value))}
                        style={{ width: '100px', marginLeft: '10px' }}
                    />
                </label>
            </div>
            <div>
                <label>
                    Gravity (m/s²):
                    <input
                        type="range"
                        min="0"
                        max="30"
                        step="0.01"
                        value={gravity}
                        onChange={(e) => setGravity(parseFloat(e.target.value))}
                    />
                    <input
                        type="number"
                        min="0"
                        max="30"
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

export default Task4;
