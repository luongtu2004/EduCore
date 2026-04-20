'use client';

import { useQuery } from '@tanstack/react-query';
import { getLeads } from '../api/get-leads';

export const useLeads = () => {
  return useQuery({
    queryKey: ['leads'],
    queryFn: getLeads,
    // Dữ liệu sẽ được cache và tự động refresh
  });
};
