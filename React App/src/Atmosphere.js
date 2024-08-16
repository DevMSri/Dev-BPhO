// src/Atmosphere.js
import React, { useState, useRef, useEffect } from 'react';
import { saveAs } from 'file-saver';

const g = 9.81; // Gravity (m/s²)
const A = 0.002; // Cross-sectional area (m²)
const m = 0.01; // Mass (kg)
const Cd = 0.3; // Drag coefficient
const rho_0 = 1.225; // Air density at sea level (kg/m³)
const H = 8500; // Scale height for air density (m)

const computeAirDensity = (y) => {
    return rho_0 * Math.exp(-y / H);
};

const computeDragForce = (vx, vy, y) => {
    const v = Math.sqrt(vx ** 2 + vy ** 2);
    const rho = computeAirDensity(y);
    return 0.5 * Cd * A * rho * v ** 2 / m;
};

const equationsWithDrag = (t, [vx, vy, x, y]) => {
    const D = computeDragForce(vx, vy, y);
    const ax = -D * vx / Math.sqrt(vx ** 2 + vy ** 2);
    const ay = -g - D * vy / Math.sqrt(vx ** 2 + vy ** 2);
    return [ax, ay, vx, vy];
};

const equationsWithoutDrag = (t, [vx, vy, x, y]) => {
    return [0, -g, vx, vy];
};

const solveProjectile = (u, theta, h, withDrag = true) => {
    const thetaRad = theta * Math.PI / 180;
    const vx0 = u * Math.cos(thetaRad);
    const vy0 = u * Math.sin(thetaRad);
    const z0 = [vx0, vy0, 0, h];
    const tSpan = [0, 20];
    const tEval = Array.from({ length: 2000 }, (_, i) => i * 0.01);

    const solve = (t, z) => {
        const dt = 0.01;
        const maxSteps = tEval.length;
        const results = [[], [], [], []];

        let tCurr = t[0];
        let zCurr = z;

        for (let i = 0; i < maxSteps; i++) {
            const [vx, vy, x, y] = zCurr;
            results[0].push(x);
            results[1].push(y);
            results[2].push(vx);
            results[3].push(vy);

            const [ax, ay] = withDrag
                ? equationsWithDrag(tCurr, zCurr).slice(0, 2)
                : equationsWithoutDrag(tCurr, zCurr).slice(0, 2);

            zCurr = [
                vx + ax * dt,
                vy + ay * dt,
                x + vx * dt,
                y + vy * dt
            ];

            tCurr += dt;
        }

        return results;
    };

    return solve(tSpan, z0);
};

const computeTrajectoryData = () => {
    const u = 10;
    const theta = 45;
    const h = 2;

    const [xDrag, yDrag, vxDrag, vyDrag] = solveProjectile(u, theta, h, true);
    const [xNoDrag, yNoDrag, vxNoDrag, vyNoDrag] = solveProjectile(u, theta, h, false);

    return {
        xDrag,
        yDrag,
        vxDrag,
        vyDrag,
        xNoDrag,
        yNoDrag,
        vxNoDrag,
        vyNoDrag
    };
};

const Atmosphere = () => {
    const [trajectoryData, setTrajectoryData] = useState({ xDrag: [], yDrag: [], vxDrag: [], vyDrag: [], xNoDrag: [], yNoDrag: [], vxNoDrag: [], vyNoDrag: [] });
    const [isProcessing, setIsProcessing] = useState(true);
    const [videoBlob, setVideoBlob] = useState(null);
    const [isReadyToDownload, setIsReadyToDownload] = useState(false);
    const canvasRef = useRef(null);
    const mediaRecorderRef = useRef(null);

    useEffect(() => {
        setTrajectoryData(computeTrajectoryData());
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        if (!context) {
            console.error('Canvas context not found.');
            return;
        }

        const width = 800;
        const height = 600;
        canvas.width = width;
        canvas.height = height;

        const stream = canvas.captureStream(60); // Capture at 60 FPS
        const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
        mediaRecorderRef.current = mediaRecorder;

        const chunks = [];
        mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
        mediaRecorder.onstop = () => {
            const blob = new Blob(chunks, { type: 'video/webm' });
            setVideoBlob(blob);
            setIsProcessing(false);
            setIsReadyToDownload(true);
        };

        let frameIndex = 0;
        const fps = 60;
        const frameDuration = 1000 / fps;

        const getMaxValues = (data) => {
            return {
                maxX: Math.max(...data.xDrag, ...data.xNoDrag),
                maxY: Math.max(...data.yDrag, ...data.yNoDrag)
            };
        };

        const { maxX, maxY } = getMaxValues(trajectoryData);

        const xScale = (width - 100) / maxX;
        const yScale = (height - 100) / maxY;

        const drawGraphBackground = () => {
            context.clearRect(0, 0, width, height);

            // Draw grid
            context.strokeStyle = 'lightgray';
            context.lineWidth = 1;
            context.beginPath();
            for (let i = 0; i <= width; i += 50) {
                context.moveTo(i, 0);
                context.lineTo(i, height);
            }
            for (let i = 0; i <= height; i += 50) {
                context.moveTo(0, i);
                context.lineTo(width, i);
            }
            context.stroke();

            // Draw axes
            context.strokeStyle = 'black';
            context.lineWidth = 2;
            context.beginPath();
            context.moveTo(50, height - 50); // X-axis
            context.lineTo(width - 50, height - 50);
            context.moveTo(50, height - 50); // Y-axis
            context.lineTo(50, 50);
            context.stroke();

            // Labels
            context.font = '16px Arial';
            context.fillStyle = 'black';
            context.textAlign = 'center';
            context.fillText('Horizontal Distance (m)', width / 2, height - 20);
            context.save();
            context.rotate(-Math.PI / 2);
            context.fillText('Vertical Distance (m)', -height / 2, 20);
            context.restore();

            // Draw scales
            context.font = '12px Arial';
            context.fillStyle = 'black';
            for (let i = 0; i <= maxX; i += maxX / 10) {
                context.fillText(i.toFixed(2), 50 + i * xScale, height - 35);
            }
            for (let i = 0; i <= maxY; i += maxY / 10) {
                context.fillText((maxY - i).toFixed(2), 30, height - 50 - i * yScale);
            }
        };

        const drawTrajectory = () => {
            context.strokeStyle = 'blue';
            context.lineWidth = 2;
            context.beginPath();
            context.moveTo(50, height - 50 - trajectoryData.yDrag[0] * yScale);
            for (let j = 1; j <= frameIndex; j++) {
                context.lineTo(50 + trajectoryData.xDrag[j] * xScale, height - 50 - trajectoryData.yDrag[j] * yScale);
            }
            context.stroke();

            context.fillStyle = 'blue';
            context.beginPath();
            context.arc(50 + trajectoryData.xDrag[frameIndex] * xScale, height - 50 - trajectoryData.yDrag[frameIndex] * yScale, 5, 0, Math.PI * 2);
            context.fill();

            context.strokeStyle = 'green';
            context.lineWidth = 2;
            context.beginPath();
            context.moveTo(50, height - 50 - trajectoryData.yNoDrag[0] * yScale);
            for (let j = 1; j <= frameIndex; j++) {
                context.lineTo(50 + trajectoryData.xNoDrag[j] * xScale, height - 50 - trajectoryData.yNoDrag[j] * yScale);
            }
            context.stroke();

            context.fillStyle = 'green';
            context.beginPath();
            context.arc(50 + trajectoryData.xNoDrag[frameIndex] * xScale, height - 50 - trajectoryData.yNoDrag[frameIndex] * yScale, 5, 0, Math.PI * 2);
            context.fill();
        };

        const drawBox = (x, y, color, title, speed, pressure, time) => {
            context.fillStyle = color;
            context.fillRect(x, y, 140, 80);
            context.strokeStyle = 'black';
            context.strokeRect(x, y, 140, 80);
            context.fillStyle = 'white';
            context.font = '12px Arial';
            context.textAlign = 'left';
            context.fillText(`${title}:`, x + 10, y + 15);

            // Ensure all text fits in the box
            context.fillText(`Speed: ${speed.toFixed(2)} m/s`, x + 10, y + 30);
            context.fillText(`Pressure: ${pressure.toFixed(2)} N/m²`, x + 10, y + 45);
            if (typeof time === 'number') {
                context.fillText(`Time to x-axis: ${time.toFixed(2)} s`, x + 10, y + 60);
            } else {
                context.fillText(`Time to x-axis: -`, x + 10, y + 60);
            }
        };

        const drawInfoBoxes = () => {
            const timeToXAxisDrag = trajectoryData.yDrag[frameIndex] >= 0
                ? (frameIndex / fps).toFixed(2)
                : 0;
            const timeToXAxisNoDrag = trajectoryData.yNoDrag[frameIndex] >= 0
                ? (frameIndex / fps).toFixed(2)
                : 0;

            if (trajectoryData.yDrag[frameIndex] >= 0) {
                const vx = trajectoryData.vxDrag[frameIndex];
                const vy = trajectoryData.vyDrag[frameIndex];
                const speed = Math.sqrt(vx ** 2 + vy ** 2);
                const pressure = computeDragForce(vx, vy, trajectoryData.yDrag[frameIndex]);
                drawBox(width - 150, 10, 'blue', 'With Drag', speed, pressure, Number(timeToXAxisDrag));
            }

            if (trajectoryData.yNoDrag[frameIndex] >= 0) {
                const vx = trajectoryData.vxNoDrag[frameIndex];
                const vy = trajectoryData.vyNoDrag[frameIndex];
                const speed = Math.sqrt(vx ** 2 + vy ** 2);
                const pressure = 0;
                drawBox(width - 150, 90, 'green', 'Without Drag', speed, pressure, Number(timeToXAxisNoDrag));
            }
        };

        const updateFrame = () => {
            drawGraphBackground();
            drawTrajectory();
            drawInfoBoxes();
        };

        let animationFrameId;
        const animate = () => {
            if (frameIndex < trajectoryData.xDrag.length - 1 && trajectoryData.yDrag[frameIndex] >= 0) {
                frameIndex++;
            } else {
                frameIndex = 0; // Reset frame index for repeat
            }
            updateFrame();
            animationFrameId = requestAnimationFrame(animate);
        };

        mediaRecorder.start();
        animate();

        return () => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        };
    }, [trajectoryData]);

    const handleDownload = () => {
        if (videoBlob) {
            saveAs(videoBlob, 'trajectory.webm');
        }
    };

    return (
        <div>
            <h1>Projectile Trajectory Simulation</h1>
            <canvas ref={canvasRef} style={{ border: '1px solid black' }} />
            {isProcessing && <p>Processing video...</p>}
            {isReadyToDownload && <button onClick={handleDownload}>Download Video</button>}
        </div>
    );
};

export default Atmosphere;
