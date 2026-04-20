'use client';

import { useQuery } from '@tanstack/react-query';
import { getPosts } from '../api/get-posts';

export const usePosts = () => {
  return useQuery({
    queryKey: ['posts'],
    queryFn: getPosts,
  });
};
