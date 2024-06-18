import React from 'react'
import { Outlet, Navigate } from 'react-router-dom';
import { localStorageKey } from '../constanta';

const ProtectedRoutes: React.FC = () => {
    const user = localStorage.getItem(localStorageKey.JWT);

    return user ? <Outlet /> : <Navigate to='/' />
};

export default ProtectedRoutes