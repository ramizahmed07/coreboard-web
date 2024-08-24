import { useMutation } from '@tanstack/react-query';
import { httpClient } from '../../../lib/httpClient';

interface Payload {
  username: string;
}

const sendEmail = async (data: Payload) => {
  return httpClient.post('/forgot', {
    data: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export default function useSendEmail() {
  return useMutation({
    mutationFn: sendEmail,
  });
}
