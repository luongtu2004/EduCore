import api from '@/lib/axios';

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: 'ADMIN' | 'STAFF' | 'TEACHER';
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
}

export const getUsers = async (): Promise<User[]> => {
  const response = await api.get('/auth/users'); // Giả định endpoint này tồn tại
  return (response as any).data;
};
