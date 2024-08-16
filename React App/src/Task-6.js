// src/Task-6.js
import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';

const Task6 = () => {
    const [theta, setTheta] = useState(60); // Angle in degrees
    const [initialSpeed, setInitialSpeed] = useState(10); // Initial speed in m/s
    const [initialHeight, setInitialHeight] = useState(2); // Initial height in meters
    const [gravity, setGravity] = useState(9.81); // Gravity in m/s²
    const [data, setData] = useState([]);
    const [output, setOutput] = useState({});

    const zFunc = (z) => {
        return 0.5 * Math.log(Math.abs(Math.sqrt(1 + z ** 2) + z)) + 0.5 * z * Math.sqrt(1 + z ** 2);
    };

    const pcalc = (theta, u, g, h, N) => {
        const thetaRad = theta * (Math.PI / 180); // Convert to radians
        const R = ((u ** 2) / g) * (Math.sin(thetaRad) * Math.cos(thetaRad) + Math.cos(thetaRad) * Math.sqrt(Math.sin(thetaRad) ** 2 + 2 * g * h / (u ** 2)));
        const x = Array.from({ length: N }, (_, i) => (i / (N - 1)) * R);
        const t = x.map(xi => xi / (u * Math.cos(thetaRad)));
        const T = R / (u * Math.cos(thetaRad));
        const y = x.map(xi => h + xi * Math.tan(thetaRad) - (g / (2 * u ** 2)) * (xi ** 2) * (1 + Math.tan(thetaRad) ** 2));
        const ta = u * Math.sin(thetaRad) / g;
        const xa = (u ** 2) * Math.sin(2 * thetaRad) / (2 * g);
        const ya = h + ((u ** 2) / (2 * g)) * Math.sin(thetaRad) ** 2;
        const vx = Array(N).fill(u * Math.cos(thetaRad));
        const vy = vx.map((_, i) => u * Math.sin(thetaRad) - g * t[i]);
        const v = vx.map((_, i) => Math.sqrt(vx[i] ** 2 + vy[i] ** 2));
        const phi = vx.map((_, i) => Math.atan2(vy[i], vx[i]));

        const a = (u ** 2) / (g * (1 + (Math.tan(thetaRad)) ** 2));
        const b = Math.tan(thetaRad);
        const c = Math.tan(thetaRad) - g * R * (1 + (Math.tan(thetaRad)) ** 2) / (u ** 2);
        const s = a * (zFunc(b) - zFunc(c));

        const dx = x.slice(1).map((xi, i) => xi - x[i]);
        const dy = y.slice(1).map((yi, i) => yi - y[i]);
        const sNumeric = dx.reduce((sum, dx, i) => sum + Math.sqrt(dx ** 2 + dy[i] ** 2), 0);
        const thetaM = Math.asin(Math.sqrt(1 / (2 + 2 * g * h / (u ** 2)))) * (180 / Math.PI);
        const Tm = (u / g) * Math.sqrt(2 + 2 * g * h / (u ** 2));
        const Rm = ((u ** 2) / g) * Math.sqrt(1 + 2 * g * h / (u ** 2));

        return { R, x, y, T, ta, xa, ya, s, sNumeric, thetaM, Tm, Rm };
    };

    useEffect(() => {
        const pGiven = pcalc(theta, initialSpeed, gravity, initialHeight, 500);
        const thetaOptimal = Math.asin(1 / Math.sqrt(2 + 2 * gravity * initialHeight / (initialSpeed ** 2))) * (180 / Math.PI);
        const pOptimal = pcalc(thetaOptimal, initialSpeed, gravity, initialHeight, 500);

        setData([
            {
                x: pGiven.x,
                y: pGiven.y,
                type: 'scatter',
                mode: 'lines',
                line: { color: 'blue' },
                name: `Given Angle: ${theta} degrees`,
            },
            {
                x: pOptimal.x,
                y: pOptimal.y,
                type: 'scatter',
                mode: 'lines',
                line: { color: 'red', dash: 'dash' },
                name: `Optimal Angle: ${thetaOptimal.toFixed(2)} degrees`,
            }
        ]);

        setOutput({
            'Given Trajectory': {
                'Range': `${pGiven.R.toFixed(2)} m`,
                'Time of flight': `${pGiven.T.toFixed(2)} s`,
                'Apogee': `(${pGiven.xa.toFixed(2)}, ${pGiven.ya.toFixed(2)}) m`,
                'Length of trajectory (analytical)': `${pGiven.s.toFixed(2)} m`,
                'Length of trajectory (numeric)': `${pGiven.sNumeric.toFixed(2)} m`,
            },
            'Optimal Trajectory for Max Range': {
                'Range': `${pOptimal.R.toFixed(2)} m`,
                'Time of flight': `${pOptimal.T.toFixed(2)} s`,
                'Apogee': `(${pOptimal.xa.toFixed(2)}, ${pOptimal.ya.toFixed(2)}) m`,
                'Length of trajectory (analytical)': `${pOptimal.s.toFixed(2)} m`,
                'Length of trajectory (numeric)': `${pOptimal.sNumeric.toFixed(2)} m`,
            }
        });
    }, [theta, initialSpeed, initialHeight, gravity]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <h1>Task 6 - Projectile Trajectories</h1>
            <div style={{ display: 'flex' }}>
                <div style={{ flex: 1 }}>
                    <Plot
                        data={data}
                        layout={{
                            title: 'Projectile Trajectories',
                            xaxis: { title: 'Horizontal Distance (m)' },
                            yaxis: { title: 'Vertical Distance (m)' },
                        }}
                        style={{ width: '100%', height: '500px' }}
                    />
                </div>
                <div style={{ marginLeft: '20px' }}>
                    {Object.entries(output).map(([key, values]) => (
                        <div key={key} style={{ marginBottom: '20px' }}>
                            <h2>{key}</h2>
                            <ul>
                                {Object.entries(values).map(([subKey, value]) => (
                                    <li key={subKey}><strong>{subKey}:</strong> {value}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
            <div>
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
            </div>
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
                        value={initialHeight}
                        onChange={(e) => setInitialHeight(parseFloat(e.target.value))}
                    />
                    <input
                        type="number"
                        min="0"
                        max="1000"
                        step="0.01"
                        value={initialHeight.toFixed(2)}
                        onChange={(e) => setInitialHeight(parseFloat(e.target.value))}
                        style={{ width: '100px', marginLeft: '10px' }}
                    />
                </label>
            </div>
            <div>
                <label>
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

export default Task6;
