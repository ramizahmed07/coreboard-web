import { useMutation } from '@tanstack/react-query';

import { httpClient } from '../../../lib/httpClient';

interface Payload {
  token: string;
  password: string;
}

const resetPassword = async (data: Payload) => {
  return httpClient.post(`/reset-password/${data.token}`, {
    data: JSON.stringify({ password: data.password }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export default function useResetPassword() {
  return useMutation({
    mutationFn: resetPassword,
  });
}
