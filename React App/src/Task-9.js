// src/Task-9.js
import React, { useState, useRef, useEffect } from 'react';
import { saveAs } from 'file-saver';

// Constants
const g = 9.81;
const dt = 0.01;
const N_bounces = 10;
const e = 0.8;
const c = 0.1;

const x0 = 0;
const y0 = 10;
const vx0 = 2;
const vy0 = 10;

const computeTrajectory = () => {
    let x_drag_free = [x0];
    let y_drag_free = [y0];
    let x_drag = [x0];
    let y_drag = [y0];

    let x_curr_df = x0;
    let y_curr_df = y0;
    let vx_curr_df = vx0;
    let vy_curr_df = vy0;
    let bounces_df = 0;

    while (bounces_df < N_bounces) {
        let x_next_df = x_curr_df + vx_curr_df * dt;
        let y_next_df = y_curr_df + vy_curr_df * dt - 0.5 * g * dt ** 2;
        let vy_next_df = vy_curr_df - g * dt;

        if (y_next_df < 0) {
            y_next_df = 0;
            vy_next_df = -e * vy_curr_df;
            bounces_df += 1;
        }

        x_drag_free.push(x_next_df);
        y_drag_free.push(y_next_df);
        x_curr_df = x_next_df;
        y_curr_df = y_next_df;
        vy_curr_df = vy_next_df;
    }

    let x_curr_drag = x0;
    let y_curr_drag = y0;
    let vx_curr_drag = vx0;
    let vy_curr_drag = vy0;
    let bounces_drag = 0;

    while (bounces_drag < N_bounces) {
        let v_curr_drag = Math.sqrt(vx_curr_drag ** 2 + vy_curr_drag ** 2);
        let drag_fx = -c * v_curr_drag * vx_curr_drag;
        let drag_fy = -c * v_curr_drag * vy_curr_drag;
        let x_next_drag = x_curr_drag + vx_curr_drag * dt + 0.5 * drag_fx * dt ** 2;
        let y_next_drag = y_curr_drag + vy_curr_drag * dt - 0.5 * g * dt ** 2 + 0.5 * drag_fy * dt ** 2;
        let vx_next_drag = vx_curr_drag + drag_fx * dt;
        let vy_next_drag = vy_curr_drag - g * dt + drag_fy * dt;

        if (y_next_drag < 0) {
            y_next_drag = 0;
            vy_next_drag = -e * vy_curr_drag;
            bounces_drag += 1;
        }

        x_drag.push(x_next_drag);
        y_drag.push(y_next_drag);
        x_curr_drag = x_next_drag;
        y_curr_drag = y_next_drag;
        vx_curr_drag = vx_next_drag;
        vy_curr_drag = vy_next_drag;
    }

    return {
        x_drag_free,
        y_drag_free,
        x_drag,
        y_drag
    };
};

const Task9 = () => {
    const [isProcessing, setIsProcessing] = useState(true);
    const [videoBlob, setVideoBlob] = useState(null);
    const [isReadyToDownload, setIsReadyToDownload] = useState(false);
    const canvasRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const [trajectoryData, setTrajectoryData] = useState({ x_drag_free: [], y_drag_free: [], x_drag: [], y_drag: [] });
    const [animationFrameCount, setAnimationFrameCount] = useState(0);
    const [hasCompletedFirstLoop, setHasCompletedFirstLoop] = useState(false);

    useEffect(() => {
        // Precompute trajectory data
        setTrajectoryData(computeTrajectory());
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
            setIsReadyToDownload(true); // Enable download after recording
        };

        let frameIndex = 0;
        const fps = 60;
        const frameDuration = 1000 / fps;

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
            for (let i = 0; i <= width - 100; i += 50) {
                context.fillText(i / 10, 50 + i, height - 35);
            }
            for (let i = 0; i <= height - 100; i += 50) {
                context.fillText((height - 50 - i) / 10, 30, height - 50 - i);
            }
        };

        const renderFrame = () => {
            drawGraphBackground();

            // Draw drag-free trajectory
            context.strokeStyle = 'blue';
            context.lineWidth = 2;
            context.beginPath();
            context.moveTo(50, height - 50 - trajectoryData.y_drag_free[0] * 10);
            for (let j = 1; j <= frameIndex; j++) {
                context.lineTo(50 + trajectoryData.x_drag_free[j] * 10, height - 50 - trajectoryData.y_drag_free[j] * 10);
            }
            context.stroke();

            context.fillStyle = 'blue'; // Correct color for drag-free trajectory
            context.beginPath();
            context.arc(50 + trajectoryData.x_drag_free[frameIndex] * 10, height - 50 - trajectoryData.y_drag_free[frameIndex] * 10, 5, 0, Math.PI * 2);
            context.fill();

            // Draw trajectory with drag
            context.strokeStyle = 'red';
            context.lineWidth = 2;
            context.beginPath();
            context.moveTo(50, height - 50 - trajectoryData.y_drag[0] * 10);
            for (let j = 1; j <= frameIndex; j++) {
                context.lineTo(50 + trajectoryData.x_drag[j] * 10, height - 50 - trajectoryData.y_drag[j] * 10);
            }
            context.stroke();

            context.fillStyle = 'red'; // Correct color for trajectory with drag
            context.beginPath();
            context.arc(50 + trajectoryData.x_drag[frameIndex] * 10, height - 50 - trajectoryData.y_drag[frameIndex] * 10, 5, 0, Math.PI * 2);
            context.fill();
        };

        const animate = () => {
            let recordingStarted = false;
            const renderLoop = () => {
                renderFrame();

                frameIndex = (frameIndex + 1) % trajectoryData.x_drag_free.length; // Loop animation
                if (frameIndex === 0) {
                    setAnimationFrameCount(prevCount => prevCount + 1);
                }

                // Start recording if the animation completes the first loop and recording hasn't started
                if (animationFrameCount === 1 && !hasCompletedFirstLoop) {
                    setHasCompletedFirstLoop(true);
                    if (!recordingStarted) {
                        mediaRecorder.start();
                        recordingStarted = true;
                    }
                }

                // Loop the animation continuously
                requestAnimationFrame(() => {
                    setTimeout(renderLoop, frameDuration);
                });
            };

            renderLoop();
        };

        // Start animation and recording when the component mounts
        animate();

        // Cleanup function
        return () => {
            if (mediaRecorder.state === 'recording') {
                mediaRecorder.stop();
            }
        };
    }, [trajectoryData, animationFrameCount, hasCompletedFirstLoop]);

    const downloadVideo = () => {
        if (videoBlob) {
            saveAs(videoBlob, 'task9.webm');
        }
    };

    return (
        <div>
            <h1>Projectile Trajectory Comparison: Drag-Free vs. With Drag</h1>
            <div
                style={{
                    position: 'relative',
                    width: '800px',
                    height: '600px',
                    backgroundColor: 'white',
                }}
            >
                <canvas ref={canvasRef} style={{ display: 'block' }} />
            </div>
            <button onClick={downloadVideo} disabled={!isReadyToDownload}>
                {isProcessing ? 'Preparing...' : 'Download Video'}
            </button>
        </div>
    );
};

export default Task9;
