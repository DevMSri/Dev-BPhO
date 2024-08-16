// src/Task-5.js
import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';

const Task5 = () => {
    const [initialSpeed, setInitialSpeed] = useState(150);
    const [height, setHeight] = useState(300);
    const [gravity, setGravity] = useState(9.81);
    const [error, setError] = useState(null); // State to manage error messages
    const [data, setData] = useState([]); // State to store plot data

    const X = 1000;
    const Y = height; // Dynamically using height
    const u_given = initialSpeed; // Dynamically using initialSpeed

    const calculateMinimumLaunchSpeed = (X, Y) => {
        return Math.sqrt(gravity * (Y + Math.sqrt(X ** 2 + Y ** 2)));
    };

    const calculateLaunchAngles = (u, X, Y) => {
        const discriminant = u ** 4 - gravity * (gravity * X ** 2 + 2 * u ** 2 * Y);
        if (discriminant < 0) {
            throw new Error("No real solutions for the given parameters.");
        }
        const thetaHigh = Math.atan((u ** 2 + Math.sqrt(discriminant)) / (gravity * X));
        const thetaLow = Math.atan((u ** 2 - Math.sqrt(discriminant)) / (gravity * X));
        return [thetaHigh, thetaLow];
    };

    const calculateMinSpeedAngle = (X, Y) => Math.atan((Y + Math.sqrt(X ** 2 + Y ** 2)) / X);

    const generateTrajectory = (theta, v0, numPoints = 500) => {
        const tFlight = 2 * v0 * Math.sin(theta) / gravity;
        const t = Array.from({ length: numPoints }, (_, i) => (i / (numPoints - 1)) * tFlight);
        const x = t.map(ti => v0 * Math.cos(theta) * ti);
        const y = t.map(ti => v0 * Math.sin(theta) * ti - 0.5 * gravity * ti ** 2);
        return { x, y };
    };

    const generateBoundingParabola = (u, XMax, numPoints = 500) => {
        const x = Array.from({ length: numPoints }, (_, i) => (i / (numPoints - 1)) * XMax);
        const y = x.map(xi => (u ** 2 / (2 * gravity)) - (gravity / (2 * u ** 2)) * xi ** 2);
        return { x, y };
    };

    const calculateMaxRangeAngle = () => Math.PI / 4;

    useEffect(() => {
        try {
            const uMin = calculateMinimumLaunchSpeed(X, Y);
            const [thetaHigh, thetaLow] = calculateLaunchAngles(u_given, X, Y);
            const thetaMin = calculateMinSpeedAngle(X, Y);
            const thetaMaxRange = calculateMaxRangeAngle();

            const { x: xLow, y: yLow } = generateTrajectory(thetaLow, u_given);
            const { x: xHigh, y: yHigh } = generateTrajectory(thetaHigh, u_given);
            const { x: xMin, y: yMin } = generateTrajectory(thetaMin, uMin);
            const { x: xMaxRange, y: yMaxRange } = generateTrajectory(thetaMaxRange, u_given);
            const { x: xBound, y: yBound } = generateBoundingParabola(u_given, Math.max(...xMaxRange));

            setError(null); // Clear any previous errors
            setData([
                { x: xLow, y: yLow, type: 'scatter', mode: 'lines', line: { color: 'orange' }, name: 'Low ball' },
                { x: xHigh, y: yHigh, type: 'scatter', mode: 'lines', line: { color: 'blue' }, name: 'High ball' },
                { x: xMin, y: yMin, type: 'scatter', mode: 'lines', line: { color: 'gray' }, name: 'Min u' },
                { x: xMaxRange, y: yMaxRange, type: 'scatter', mode: 'lines', line: { color: 'red' }, name: 'Max range' },
                { x: xBound, y: yBound, type: 'scatter', mode: 'lines', line: { color: 'purple', dash: 'dash' }, name: 'Bounding parabola' },
                { x: [X], y: [Y], type: 'scatter', mode: 'markers', marker: { color: 'yellow', size: 10 }, name: 'Target (X, Y)' }
            ]);
        } catch (err) {
            setError(err.message); // Set error message if any issue occurs
            setData([]); // Clear data on error
        }
    }, [initialSpeed, height, gravity]);

    return (
        <div>
            <h1>Projectile to Hit (X, Y)</h1>
            {error ? (
                <div style={{ color: 'red' }}>
                    <h2>Error: {error}</h2>
                </div>
            ) : (
                <Plot
                    data={data}
                    layout={{
                        title: 'Projectile to Hit (X, Y)',
                        xaxis: { title: 'x / m' },
                        yaxis: { title: 'y above launch height / m' },
                    }}
                    style={{ width: '100%', height: '500px' }}
                />
            )}
            <div>
                <label>
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

export default Task5;
