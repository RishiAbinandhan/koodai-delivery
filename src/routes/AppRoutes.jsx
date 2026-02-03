import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Home from '../features/dashboard/Home';
import Login from '../features/auth/Login';

export default function AppRoutes() {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Home />} />
                <Route path="/auth/login" element={<Login />} />
            </Route>
        </Routes>
    );
}
