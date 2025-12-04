import { BASE_URL } from '../api/axios';

export const getImageUrl = (path) => {
  if (!path) return '/placeholder.jpg';
  if (path.startsWith('http')) return path;
  
  // Remove leading slash if present to avoid double slashes
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // Base URL usually ends with /api, we need the root
  const rootUrl = BASE_URL.replace('/api', '');
  
  return `${rootUrl}/${cleanPath}`;
};
