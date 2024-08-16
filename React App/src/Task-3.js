// src/MainPage.js
import React, { useState, useCallback, useEffect } from 'react';
import Plot from 'react-plotly.js';
import debounce from 'lodash/debounce';

const planets = {
    Mercury: { gravity: 3.7, maxX: 2439.7 * Math.PI, maxY: 4879.4 * 1000, maxHeight: 100000 },
    Venus: { gravity: 8.87, maxX: 6051.8 * Math.PI, maxY: 12104 * 1000, maxHeight: 100000 },
    Earth: { gravity: 9.81, maxX: 6371.0 * Math.PI, maxY: 10000000, maxHeight: 10000000 },
    Mars: { gravity: 3.71, maxX: 3389.5 * Math.PI, maxY: 10000000, maxHeight: 10000000 },
    Jupiter: { gravity: 24.79, maxX: 69911.0 * Math.PI, maxY: 10000000, maxHeight: 10000000 },
    Saturn: { gravity: 10.44, maxX: 58232.0 * Math.PI, maxY: 10000000, maxHeight: 10000000 },
    Uranus: { gravity: 8.69, maxX: 25362.0 * Math.PI, maxY: 10000000, maxHeight: 10000000 },
    Neptune: { gravity: 11.15, maxX: 24622.0 * Math.PI, maxY: 10000000, maxHeight: 10000000 },
};

const projectileMotion = (theta, u, h, g, X_target, Y_target, dt = 0.01) => {
    const thetaRad = (theta * Math.PI) / 180;
    const ux = u * Math.cos(thetaRad);
    const uy = u * Math.sin(thetaRad);
    const x = [0.0];
    const y = [h];
    const t = [0.0];
    let vx = ux;
    let vy = uy;

    while (y[y.length - 1] >= 0 && x[x.length - 1] <= X_target) {
        vy -= g * dt;
        x.push(x[x.length - 1] + vx * dt);
        y.push(y[y.length - 1] + vy * dt);
        t.push(t[t.length - 1] + dt);
    }

    if (x[x.length - 1] < X_target) {
        x.push(X_target);
        y.push(Y_target);
    } else if (x[x.length - 1] > X_target) {
        const ratio = (X_target - x[x.length - 2]) / (x[x.length - 1] - x[x.length - 2]);
        x.push(X_target);
        y.push(y[y.length - 2] + ratio * (y[y.length - 1] - y[y.length - 2]));
    }

    return { x, y };
};

const calculateTrajectories = (theta, u, h, g, X_target, Y_target, dt) => {
    const discriminant = u ** 4 - g * (g * X_target ** 2 + 2 * u ** 2 * Y_target);
    if (discriminant < 0) {
        throw new Error("No real solutions for the given parameters.");
    }
    const thetaHigh = Math.atan((u ** 2 + Math.sqrt(discriminant)) / (g * X_target)) * (180 / Math.PI);
    const thetaLow = Math.atan((u ** 2 - Math.sqrt(discriminant)) / (g * X_target)) * (180 / Math.PI);

    const highBall = projectileMotion(thetaHigh, u, h, g, X_target, Y_target, dt);
    const lowBall = projectileMotion(thetaLow, u, h, g, X_target, Y_target, dt);

    const minSpeed = Math.sqrt(g * (Y_target + Math.sqrt(X_target ** 2 + Y_target ** 2)));
    const min_u = projectileMotion(Math.atan((Y_target + Math.sqrt(X_target ** 2 + Y_target ** 2)) / X_target) * (180 / Math.PI), minSpeed, h, g, X_target, Y_target, dt);

    return { highBall, lowBall, min_u };
};

const getAxisRange = (data) => {
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;

    data.forEach((trajectory) => {
        const { x, y } = trajectory;
        minX = Math.min(minX, ...x);
        maxX = Math.max(maxX, ...x);
        minY = Math.min(minY, ...y);
        maxY = Math.max(maxY, ...y);
    });

    return {
        xaxis: { range: [minX, maxX] },
        yaxis: { range: [minY, maxY] }
    };
};

const MainPage = () => {
    const [theta, setTheta] = useState(45.0);
    const [initialSpeed, setInitialSpeed] = useState(150.0);
    const [height, setHeight] = useState(2.0);
    const [x, setX] = useState(1000.0);
    const [y, setY] = useState(300.0);
    const [selectedPlanet, setSelectedPlanet] = useState('Earth');
    const [data, setData] = useState({ highBall: { x: [], y: [] }, lowBall: { x: [], y: [] }, min_u: { x: [], y: [] }, target: { x: [], y: [] } });
    const { gravity, maxX, maxY, maxHeight } = planets[selectedPlanet];
    const dt = 0.01;
    const speedOfLight = 299792458; // Speed of light in m/s

    const debouncedRecalculate = useCallback(
        debounce(() => {
            try {
                const { highBall, lowBall, min_u } = calculateTrajectories(theta, initialSpeed, height, gravity, x, y, dt);
                setData({
                    highBall,
                    lowBall,
                    min_u,
                    target: { x: [x], y: [y] }
                });
            } catch (error) {
                console.error(error);
            }
        }, 300),
        [theta, initialSpeed, height, x, y, selectedPlanet, gravity, dt]
    );

    useEffect(() => {
        debouncedRecalculate();
        return () => debouncedRecalculate.cancel();
    }, [theta, initialSpeed, height, x, y, selectedPlanet, debouncedRecalculate]);

    const handlePlanetChange = (event) => {
        const planet = event.target.value;
        setSelectedPlanet(planet);
    };

    const handleThetaChange = (event) => {
        const value = parseFloat(event.target.value);
        if (value >= -90 && value <= 90) setTheta(value);
    };

    const handleSpeedChange = (event) => {
        const value = parseFloat(event.target.value);
        if (value >= 0 && value <= speedOfLight) setInitialSpeed(value);
    };

    const handleHeightChange = (event) => {
        const value = parseFloat(event.target.value);
        if (value >= 0 && value <= maxHeight) setHeight(value);
    };

    const handleXChange = (event) => {
        const value = parseFloat(event.target.value);
        if (value >= 0 && value <= maxX) setX(value);
    };

    const handleYChange = (event) => {
        const value = parseFloat(event.target.value);
        if (value >= 0 && value <= maxY) setY(value);
    };

    const axisRange = getAxisRange([
        data.highBall,
        data.lowBall,
        data.min_u,
        data.target
    ]);

    return (
        <div>
            <h1>Projectile Motion</h1>
            <Plot
                data={[
                    {
                        x: data.lowBall.x,
                        y: data.lowBall.y,
                        type: 'scatter',
                        mode: 'lines',
                        name: 'Low-Ball Trajectory',
                        marker: { color: 'orange' },
                    },
                    {
                        x: data.highBall.x,
                        y: data.highBall.y,
                        type: 'scatter',
                        mode: 'lines',
                        name: 'High-Ball Trajectory',
                        marker: { color: 'blue' },
                    },
                    {
                        x: data.min_u.x,
                        y: data.min_u.y,
                        type: 'scatter',
                        mode: 'lines',
                        name: 'Min Speed Trajectory',
                        marker: { color: 'gray' },
                    },
                    {
                        x: data.target.x,
                        y: data.target.y,
                        type: 'scatter',
                        mode: 'markers',
                        name: 'Target Point',
                        marker: { color: 'yellow', size: 10 },
                    },
                ]}
                layout={{
                    title: 'Projectile Motion',
                    xaxis: { title: 'x / m', ...axisRange.xaxis },
                    yaxis: { title: 'y / m', ...axisRange.yaxis },
                    autosize: true
                }}
            />
            <div>
                <label>
                    Angle (degrees):
                    <input
                        type="range"
                        min="-90"
                        max="90"
                        step="0.001"
                        value={theta}
                        onChange={handleThetaChange}
                    />
                    <input
                        type="number"
                        min="-90"
                        max="90"
                        step="0.001"
                        value={theta.toFixed(3)}
                        onChange={(e) => setTheta(parseFloat(e.target.value))}
                        style={{ width: '150px', marginLeft: '10px' }}
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
                        onChange={(e) => setInitialSpeed(parseFloat(e.target.value))}
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
                        onChange={(e) => setHeight(parseFloat(e.target.value))}
                        style={{ width: '150px', marginLeft: '10px' }}
                    />
                </label>
            </div>
            <div>
                <label>
                    X (m):
                    <input
                        type="range"
                        min="0"
                        max={maxX}
                        step="0.001"
                        value={x}
                        onChange={handleXChange}
                    />
                    <input
                        type="number"
                        min="0"
                        max={maxX}
                        step="0.001"
                        value={x.toFixed(3)}
                        onChange={(e) => setX(parseFloat(e.target.value))}
                        style={{ width: '150px', marginLeft: '10px' }}
                    />
                </label>
            </div>
            <div>
                <label>
                    Y (m):
                    <input
                        type="range"
                        min="0"
                        max={maxY}
                        step="0.001"
                        value={y}
                        onChange={handleYChange}
                    />
                    <input
                        type="number"
                        min="0"
                        max={maxY}
                        step="0.001"
                        value={y.toFixed(3)}
                        onChange={(e) => setY(parseFloat(e.target.value))}
                        style={{ width: '150px', marginLeft: '10px' }}
                    />
                </label>
            </div>
            <div>
                <label>
                    Select Planet:
                    <select value={selectedPlanet} onChange={handlePlanetChange}>
                        {Object.keys(planets).map((planet) => (
                            <option key={planet} value={planet}>
                                {planet}
                            </option>
                        ))}
                    </select>
                </label>
            </div>
        </div>
    );
};

export default MainPage;
