import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { useAuth } from '../../contexts/auth';
import { httpClient } from '../../lib/httpClient';
import { toast } from 'sonner';
// import { toast } from 'sonner';

export default function Header() {
  const navigate = useNavigate();
  const { isAuthenticated, dispatch, user } = useAuth();

  const handleLogout = async () => {
    try {
      // make api call to clear cookies
      await httpClient.delete('/logout', {
        headers: {
          'x-authorization': localStorage.getItem('access_token'),
        },
      });
      // clear data from auth context
      dispatch({ type: 'LOG_OUT' });
      // navigate to auth page
      navigate('/signin', {
        replace: true,
      });
    } catch (error) {
      console.log(error);
      toast.error(
        'There was some issue logging you out. Please try again later.'
      );
    }
  };

  if (!isAuthenticated) return null;

  return (
    <header className='flex justify-between'>
      <div className='space-x-2'>
        <Button variant='secondary' asChild>
          <Link to='/'>Home</Link>
        </Button>
        {user?.role === 'teacher' && (
          <Button variant='secondary' asChild>
            <Link to='/manage-students'>Manage Students</Link>
          </Button>
        )}
      </div>
      <div>
        <Button onClick={handleLogout}>Logout</Button>
      </div>
    </header>
  );
}
