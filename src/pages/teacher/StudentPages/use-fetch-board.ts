import { useQuery } from '@tanstack/react-query';
import { httpClient } from '../../../lib/httpClient';

const fetchBoard = async (_id: string) => {
  return httpClient.get(`/get-board/${_id}`, {
    headers: {
      'x-authorization': localStorage.getItem('access_token'),
    },
  });
};

export default function useFetchBoard(_id: string) {
  return useQuery({
    queryKey: ['board', { _id }],
    queryFn: () => fetchBoard(_id),
  });
}
