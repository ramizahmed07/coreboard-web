import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '../../lib/queryClient';
import { httpClient } from '../../lib/httpClient';

interface Payload {
  username: string;
  password: string;
}

const createStudent = async (data: Payload) => {
  return httpClient.post('/create-student', {
    data: {
      ...data,
      role: 'student',
    },
    headers: {
      'x-authorization': localStorage.getItem('access_token'),
    },
  });
};

export default function useCreateStudent() {
  return useMutation({
    mutationFn: createStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
    onError: () => {
      toast.error('Failed to create student');
    },
  });
}
