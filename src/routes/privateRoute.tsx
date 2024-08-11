import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/auth';

interface PrivateRouteProps {
  teacher?: boolean;
  children: React.ReactNode;
}

export const PrivateRoute = ({
  teacher = false,
  children,
}: PrivateRouteProps) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to='/signin' state={{ from: location.pathname }} />;
  }

  if (teacher && user && user.role !== 'teacher') return <Navigate to='/' />;

  return children;
};

PrivateRoute.displayName = 'PrivateRoute';
