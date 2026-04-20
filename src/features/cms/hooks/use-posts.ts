'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';

export const usePosts = () => {
  return useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const response = await api.get('/cms/posts') as any;
      return response.data;
    },
  });
};
