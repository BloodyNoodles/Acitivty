import React from 'react';
import ReactDOM from 'react-dom/client'; // Import from 'react-dom/client'
import Registration from './Registration2';
import './index.css';

// Use createRoot instead of ReactDOM.render
const root = ReactDOM.createRoot(document.getElementById('root'));

function App() {
    return (
        <div>
            <h1>My Task Management App</h1>
            <Registration />
        </div>
    );
}

// Render using the new createRoot method
root.render(<App />);
