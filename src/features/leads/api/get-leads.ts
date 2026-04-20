import api from '@/lib/axios';
import { Lead } from '../types';

export const getLeads = async (): Promise<Lead[]> => {
  const response = await api.get('/crm/leads');
  return (response as any).data;
};
