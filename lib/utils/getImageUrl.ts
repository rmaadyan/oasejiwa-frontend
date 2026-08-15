// Fallback SVG placeholder langsung tanpa panggil file gambar eksternal
const DEFAULT_PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300' fill='%23f1f5f9'%3E%3Crect width='400' height='300' fill='%23f1f5f9'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%2394a3b8' font-family='sans-serif' font-size='14' font-weight='500'%3EGambar Tidak Tersedia%3C/text%3E%3C/svg%3E";

const CLOUDINARY_CLOUD_NAME =
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dxmxxw7xh";

export function getImageUrl(path?: string | null, fallback?: string): string {
  // 1. Validasi jika path kosong / null / undefined string
  if (
    !path ||
    typeof path !== "string" ||
    path.trim() === "" ||
    path === "null" ||
    path === "undefined"
  ) {
    return fallback || DEFAULT_PLACEHOLDER;
  }

  const cleanStr = path.trim();

  // 🟢 2. SANGAT PENTING: Langsung loloskan blob (preview lokal crop browser) & data URI
  if (cleanStr.startsWith("blob:") || cleanStr.startsWith("data:")) {
    return cleanStr;
  }

  // 🟢 3. Jika sudah berupa URL lengkap HTTPS / HTTP
  if (cleanStr.startsWith("http://") || cleanStr.startsWith("https://")) {
    // Tangani jika ada URL localhost lama yang tersimpan di database
    if (cleanStr.includes("localhost")) {
      return cleanStr.replace(/http:\/\/localhost:\d+/, "https://api.oasejiwa.id");
    }
    return cleanStr;
  }

  // 🟢 4. Jika merupakan Cloudinary Public ID (misal: "duy21wtkls1yud1rvyxi" atau "psychologists/duy21...")
  // Ciri: tidak memiliki ekstensi file (.jpg, .png) atau diawali folder cloudinary
  if (!cleanStr.includes(".") || cleanStr.includes("cloudinary")) {
    const publicId = cleanStr.replace(/^\/+/, "");
    return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${publicId}`;
  }

  // 🟢 5. Default ke Backend Server VPS
  const rawBackendUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "https://api.oasejiwa.id";

  const backendUrl = rawBackendUrl.replace(/\/$/, "");
  let cleanPath = cleanStr.replace(/^\/+/, "");

  // Pastikan prefix 'uploads/' rapi
  if (cleanPath.startsWith("uploads/uploads/")) {
    cleanPath = cleanPath.replace("uploads/uploads/", "uploads/");
  } else if (!cleanPath.startsWith("uploads/")) {
    cleanPath = `uploads/${cleanPath}`;
  }

  return `${backendUrl}/${cleanPath}`;
}