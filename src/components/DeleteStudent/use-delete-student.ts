import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '../../lib/queryClient';
import { httpClient } from '../../lib/httpClient';

interface Payload {
  _id: string;
}

const deleteStudent = async (data: Payload) => {
  return httpClient.post('/delete-student', {
    data,
    headers: {
      'x-authorization': localStorage.getItem('access_token'),
    },
  });
};

export default function useDeleteStudent() {
  return useMutation({
    mutationFn: deleteStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
    onError: () => {
      toast.error('Failed to delete student');
    },
  });
}
