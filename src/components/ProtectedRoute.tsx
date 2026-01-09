import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const authData = localStorage.getItem('admin_auth');
  
  if (!authData) {
    return <Navigate to="/admin/login" replace />;
  }

  try {
    const parsed = JSON.parse(authData);
    const hoursSinceLogin = (Date.now() - parsed.timestamp) / (1000 * 60 * 60);
    
    if (hoursSinceLogin > 24) {
      localStorage.removeItem('admin_auth');
      return <Navigate to="/admin/login" replace />;
    }
  } catch {
    localStorage.removeItem('admin_auth');
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}
