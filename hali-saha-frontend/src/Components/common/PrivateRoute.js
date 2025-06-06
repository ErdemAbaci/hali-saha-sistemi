import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // AuthContext yolunu kontrol edin

const PrivateRoute = ({ children, allowedRoles }) => {
  console.log('[PrivateRoute] Checking auth...');
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  console.log('[PrivateRoute] isAuthenticated:', isAuthenticated);
  console.log('[PrivateRoute] user:', user); 

  if (!isAuthenticated) {
    console.log('[PrivateRoute] Not authenticated. Redirecting to /giris');
    return <Navigate to="/giris" state={{ from: location }} replace />;
  }

  // If authenticated but user object is not yet loaded, wait.
  if (!user) {
    console.log('[PrivateRoute] Authenticated, but user object not yet available. Waiting/Loading...');
    return null; // Or a loading spinner component
  }

  // At this point, isAuthenticated is true AND user object is available.
  console.log('[PrivateRoute] user.role:', user.role, typeof user.role); 
  console.log('[PrivateRoute] allowedRoles:', allowedRoles);

  let isRoleIncluded = false;
  if (user.role && allowedRoles) {
    isRoleIncluded = allowedRoles.includes(user.role);
    console.log(`[PrivateRoute] Checking inclusion: allowedRoles.includes('${user.role}') -> ${isRoleIncluded}`);
  } else if (allowedRoles && !user.role) { 
    console.log(`[PrivateRoute] User role is undefined/null, but roles are required. Access denied.`);
  }

  if (allowedRoles && (!user.role || !isRoleIncluded)) {
    console.log('[PrivateRoute] Role check FAILED. Redirecting.');
    console.log(`[PrivateRoute] Condition values: !user.role=${!user.role}, !isRoleIncluded=${!isRoleIncluded}`);
    // alert('Bu sayfaya erişim yetkiniz bulunmamaktadır.'); // Temporarily commented out
    return <Navigate to="/" replace />;
  }

  console.log('[PrivateRoute] Role check PASSED. Rendering children.');
  return children;
};

export default PrivateRoute;
