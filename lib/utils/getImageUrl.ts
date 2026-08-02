// src/utils/getImageUrl.ts

export const getImageUrl = (path?: string | null): string => {
  if (!path) return '/assets/placeholder-image.png'; // Fallback jika gambar kosong

  // Jika path sudah berupa URL utuh (misal dari Cloudinary/S3), langsung kembalikan
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  // Ambil URL Backend dari .env, jika tidak ada baru fallback ke localhost
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
  
  // Pastikan format garis miring (slash) rapi
  const cleanPath = path.startsWith('/') ? path : `/${path}`;

  return `${baseUrl}${cleanPath}`;
};