/**
 *
 * PrivateRoute
 * Higher Order Component that blocks navigation when the user is not logged in
 * and redirect the user to login page
 *
 * Wrap your protected routes to secure your container
 */

import React from 'react';

import auth from '../../utils/auth';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
    return auth.getToken() !== null ? <Outlet /> : <Navigate to="/auth/login" />;
}

export default PrivateRoute;
