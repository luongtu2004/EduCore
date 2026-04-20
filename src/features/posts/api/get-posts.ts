import api from '@/lib/axios';

export interface Post {
  id: string;
  title: string;
  slug: string;
  status: 'DRAFT' | 'PUBLISHED';
  category?: { name: string };
  createdAt: string;
}

export const getPosts = async (): Promise<Post[]> => {
  const response = await api.get('/cms/posts');
  return (response as any).data;
};
