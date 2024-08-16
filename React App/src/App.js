// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Task1 from './Task-1';
import Task2 from './Task-2';
import Task3 from './Task-3';
import Task4 from './Task-4';
import Task5 from './Task-5';
import Task6 from './Task-6';
import Task7 from './Task-7';
import Task8 from './Task-8';
import Task9 from './Task-9';
import Atmosphere from './Atmosphere';
import AILauncher from './AI-Launcher';

const App = () => {
    return (
        <Router>
            <div style={{ padding: '20px' }}>
                <nav>
                    <Link to="/">Task 1</Link> | <Link to="/task-2">Task 2</Link> | <Link to="/task-3">Task 3</Link> | <Link to="/task-4">Task 4</Link> | <Link to="/task-5">Task 5</Link> | <Link to="/task-6">Task 6</Link> | <Link to="/task-7">Task 7</Link> | <Link to="/task-8">Task 8</Link> | <Link to="/task-9">Task 9</Link> | <Link to="/atmosphere-extension">Atmosphere Extension</Link> | <Link to="/ai-launcher-extension">AI Launcher</Link>
                </nav>
                <Routes>
                    <Route path="/" element={<Task1 />} />
                    <Route path="/task-2" element={<Task2 />} />
                    <Route path="/task-3" element={<Task3 />} />
                    <Route path="/task-4" element={<Task4 />} />
                    <Route path="/task-5" element={<Task5 />} />
                    <Route path="/task-6" element={<Task6 />} />
                    <Route path="/task-7" element={<Task7 />} />
                    <Route path="/task-8" element={<Task8 />} />
                    <Route path="/task-9" element={<Task9 />} />
                    <Route path="/atmosphere-extension" element={<Atmosphere />} />
                    <Route path="/ai-launcher-extension" element={<AILauncher />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
