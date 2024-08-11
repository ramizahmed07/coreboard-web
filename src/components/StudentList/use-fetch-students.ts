import { httpClient } from '../../lib/httpClient';
import { User } from '../../contexts/auth';
import { useQuery } from '@tanstack/react-query';

type Response = {
  students: User[];
};

const fetchStudents = async () => {
  return httpClient.get<Response>('/get-teacher-students', {
    headers: {
      'x-authorization': localStorage.getItem('access_token'),
    },
  });
};

export default function useFetchStudents() {
  return useQuery({
    queryKey: ['students'],
    queryFn: fetchStudents,
  });
}
