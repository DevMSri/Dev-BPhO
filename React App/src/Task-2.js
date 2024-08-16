// src/MainPage.js
import React, { useState, useCallback, useEffect } from 'react';
import Plot from 'react-plotly.js';
import debounce from 'lodash/debounce';

// Function to compute projectile motion and apogee
const projectileMotion = (theta, u, h, g, dt = 0.01) => {
    const thetaRad = (theta * Math.PI) / 180;
    const ux = u * Math.cos(thetaRad);
    const uy = u * Math.sin(thetaRad);
    const x = [0.0];
    const y = [h];
    const t = [0.0];
    let vx = ux;
    let vy = uy;

    while (y[y.length - 1] >= 0) {
        vy -= g * dt;
        x.push(x[x.length - 1] + vx * dt);
        y.push(y[y.length - 1] + vy * dt);
        t.push(t[t.length - 1] + dt);
    }

    // Calculate apogee
    const apogeeIndex = y.indexOf(Math.max(...y));
    const apogeeX = x[apogeeIndex];
    const apogeeY = y[apogeeIndex];

    return { x, y, apogee: { x: apogeeX, y: apogeeY } };
};

const MainPage = () => {
    const [theta, setTheta] = useState(45.0);
    const [initialSpeed, setInitialSpeed] = useState(20.0);
    const [height, setHeight] = useState(2.0);
    const [data, setData] = useState({ x: [], y: [], apogee: { x: 0, y: 0 } });
    const g = 9.81;
    const dt = 0.01;
    const speedOfLight = 299792458; // Speed of light in m/s
    const maxHeight = 10000000; // Approximate upper limit of Earth's atmosphere in meters

    // Debounced function to recalculate projectile motion
    const debouncedRecalculate = useCallback(
        debounce((theta, speed, height) => {
            setData(projectileMotion(theta, speed, height, g, dt));
        }, 300), // Adjust the debounce delay as needed
        [g, dt]
    );

    // Recalculate projectile motion whenever theta, initialSpeed, or height changes
    useEffect(() => {
        debouncedRecalculate(theta, initialSpeed, height);
        // Cleanup debounce
        return () => {
            debouncedRecalculate.cancel();
        };
    }, [theta, initialSpeed, height, debouncedRecalculate]);

    // Handle slider and input changes
    const handleThetaChange = (event) => {
        const value = parseFloat(event.target.value);
        if (value >= 0 && value <= 90) {
            setTheta(value);
        }
    };

    const handleSpeedChange = (event) => {
        const value = parseFloat(event.target.value);
        if (value >= 0 && value <= speedOfLight) {
            setInitialSpeed(value);
        }
    };

    const handleHeightChange = (event) => {
        const value = parseFloat(event.target.value);
        if (value >= 0 && value <= maxHeight) {
            setHeight(value);
        }
    };

    const handleThetaInputChange = (event) => {
        const value = parseFloat(event.target.value);
        setTheta(value);
    };

    const handleSpeedInputChange = (event) => {
        const value = parseFloat(event.target.value);
        setInitialSpeed(value);
    };

    const handleHeightInputChange = (event) => {
        const value = parseFloat(event.target.value);
        setHeight(value);
    };

    return (
        <div>
            <h1>Projectile Motion</h1>
            <Plot
                data={[
                    {
                        x: data.x,
                        y: data.y,
                        type: 'scatter',
                        mode: 'lines',
                        name: 'Projectile Path',
                        marker: { color: 'blue' },
                    },
                    {
                        x: [data.apogee.x],
                        y: [data.apogee.y],
                        type: 'scatter',
                        mode: 'markers',
                        name: 'Apogee',
                        marker: {
                            color: 'red',
                            symbol: 'x',
                            size: 10,
                        },
                    },
                ]}
                layout={{
                    title: 'Projectile Motion',
                    xaxis: { title: 'Horizontal Distance (m)' },
                    yaxis: { title: 'Vertical Distance (m)' },
                }}
                style={{ width: '100%', height: '500px' }}
            />
            <div>
                <label>
                    Launch Angle (deg):
                    <input
                        type="range"
                        min="0"
                        max="90"
                        step="0.001"
                        value={theta}
                        onChange={handleThetaChange}
                    />
                    <input
                        type="number"
                        min="0"
                        max="90"
                        step="0.001"
                        value={theta.toFixed(3)}
                        onChange={handleThetaInputChange}
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
                        max={speedOfLight}
                        step="0.001"
                        value={initialSpeed}
                        onChange={handleSpeedChange}
                    />
                    <input
                        type="number"
                        min="0"
                        max={speedOfLight}
                        step="0.001"
                        value={initialSpeed.toFixed(3)}
                        onChange={handleSpeedInputChange}
                        style={{ width: '150px', marginLeft: '10px' }}
                    />
                </label>
            </div>
            <div>
                <label>
                    Initial Height (m):
                    <input
                        type="range"
                        min="0"
                        max={maxHeight}
                        step="0.001"
                        value={height}
                        onChange={handleHeightChange}
                    />
                    <input
                        type="number"
                        min="0"
                        max={maxHeight}
                        step="0.001"
                        value={height.toFixed(3)}
                        onChange={handleHeightInputChange}
                        style={{ width: '150px', marginLeft: '10px' }}
                    />
                </label>
            </div>
        </div>
    );
};

export default MainPage;
