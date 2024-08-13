import { useAuth } from '../../contexts/auth';
import StudentPages from '../teacher/StudentPages';

export default function Home() {
  const { user } = useAuth();

  return (
    <>
      {user?.role === 'student' ? (
        <StudentPages userId={user?._id} />
      ) : (
        <StudentPages />
      )}
    </>
  );
}
