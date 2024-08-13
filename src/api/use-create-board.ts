import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import { httpClient } from '../lib/httpClient';
import { queryClient } from '../lib/queryClient';

interface Payload {
  pages: any;
  studentIds: string[];
  isAppend?: boolean;
}

const createBoard = async (data: Payload) => {
  return httpClient.post('/create-board', {
    data: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      'x-authorization': localStorage.getItem('access_token'),
    },
  });
};

export default function useCreateBoard() {
  return useMutation({
    mutationFn: createBoard,
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey.includes('board'),
      });
    },
    onError: () => {
      toast.error('Failed to create student');
    },
  });
}
