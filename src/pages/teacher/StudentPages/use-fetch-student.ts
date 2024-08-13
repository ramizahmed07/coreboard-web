import { useQuery } from '@tanstack/react-query';
import { httpClient } from '../../../lib/httpClient';
import { User } from '../../../contexts/auth';

type Response = {
  student: User;
};

const fetchStudent = async (_id: string) => {
  return httpClient.get<Response>(`/get-student/${_id}`, {
    headers: {
      'x-authorization': localStorage.getItem('access_token'),
    },
  });
};

export default function useFetchStudent(_id: string, pathname: string) {
  return useQuery({
    queryKey: ['student', { _id }],
    queryFn: () => fetchStudent(_id),
    staleTime: Infinity,
    enabled: pathname !== '/',
  });
}
