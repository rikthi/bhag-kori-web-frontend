import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './pages/Signup/Signup';
import Login from './pages/Login/Login';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import Homepage from './pages/Homepage/Homepage';
import CreateGroup from './pages/CreateGroup/CreateGroup';
import ViewGroups from './pages/ViewGroups/ViewGroups';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/homepage" element={<Homepage />} />
                <Route path="/create-group" element={<CreateGroup />} />
                <Route path="/view-groups" element={<ViewGroups />} />
            </Routes>
        </Router>
    );
}

export default App;
