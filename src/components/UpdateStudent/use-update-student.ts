import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '../../lib/queryClient';
import { httpClient } from '../../lib/httpClient';
import { User } from '../../contexts/auth';

interface Payload {
  username: string;
  password: string;
  voice?: { lang: string; name: string };
  _id: string;
}

const updateStudent = async (data: Payload) => {
  return httpClient.post<{ student: User }>('/update-student', {
    data: {
      ...data,
    },
    headers: {
      'x-authorization': localStorage.getItem('access_token'),
    },
  });
};

export default function useUpdateStudent() {
  return useMutation({
    mutationFn: updateStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
    onError: () => {
      toast.error('Failed to update student');
    },
  });
}
