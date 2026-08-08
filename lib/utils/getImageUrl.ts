// Fallback SVG placeholder langsung tanpa panggil file gambar eksternal
const DEFAULT_PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300' fill='%23f1f5f9'%3E%3Crect width='400' height='300' fill='%23f1f5f9'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%2394a3b8' font-family='sans-serif' font-size='14' font-weight='500'%3EGambar Tidak Tersedia%3C/text%3E%3C/svg%3E";

export function getImageUrl(path?: string | null): string {
  // Jika path kosong / null / undefined / "null" / "undefined"
  if (!path || path.trim() === "" || path === "null" || path === "undefined") {
    return DEFAULT_PLACEHOLDER;
  }

  // Jika sudah berupa URL lengkap (http:// atau https://)
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  // Ambil URL backend (Default ke http://localhost:5000)
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // Bersihkan slash di depan
  let cleanPath = path.trim().replace(/^\/+/, "");

  // Pastikan ada awalan 'uploads/'
  if (cleanPath.startsWith("uploads/uploads/")) {
    cleanPath = cleanPath.replace("uploads/uploads/", "uploads/");
  } else if (!cleanPath.startsWith("uploads/")) {
    cleanPath = `uploads/${cleanPath}`;
  }

  // HASIL AKHIR: http://localhost:5000/uploads/nama-file.jpg
  return `${backendUrl}/${cleanPath}`;
}