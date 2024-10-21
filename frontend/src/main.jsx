import React from 'react';
import ReactDOM from 'react-dom/client'; // Import from 'react-dom/client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Import necessary components from react-router-dom
import Registration from './Registration2';
import App from './App.jsx'; // Import the main App component

// Use createRoot instead of ReactDOM.render
const root = ReactDOM.createRoot(document.getElementById('root'));

function Main() { // Changed the function name from App to Main
    return (
        <Router>
            <Routes>
                <Route path="/" element={<App />} /> {/* Main component for the home page */}
                <Route path="/login" element={<Registration />} /> {/* Registration component */}
            </Routes>
        </Router>
    );
}

// Render using the new createRoot method
root.render(<Main />); // Use Main instead of App
