let rawUrl =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "https://api.oasejiwa.id";

if (rawUrl.startsWith("https:/") && !rawUrl.startsWith("https://")) {
  rawUrl = rawUrl.replace("https:/", "https://");
}
const API_BASE_URL = rawUrl.replace(/\/$/, "");

export async function processSelectedImage(file: File): Promise<string> {
  const fileName = file.name.toLowerCase();
  const fileType = file.type.toLowerCase();

  const isHeic =
    fileType === "image/heic" ||
    fileType === "image/heif" ||
    fileName.endsWith(".heic") ||
    fileName.endsWith(".heif");

  // 1. Format Gambar Reguler (JPG, PNG, WebP, GIF)
  if (!isHeic) {
    try {
      return URL.createObjectURL(file);
    } catch {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }
  }

  // 2. Format HEIC: Coba decode di browser
  if (typeof window !== "undefined") {
    // Jalur A: Coba decode client heic2any / heic-to
    try {
      const heic2anyModule = await import("heic2any");
      const heic2any = (heic2anyModule as any).default || heic2anyModule;
      const converted = await heic2any({
        blob: file,
        toType: "image/jpeg",
        quality: 0.8,
      });

      const blobResult = Array.isArray(converted) ? converted[0] : converted;
      if (blobResult) {
        return URL.createObjectURL(blobResult);
      }
    } catch {
      // Decode client gagal (ERR_LIBHEIF format not supported), lanjut ke fallback server
    }

    // Jalur B: Fallback konversi instan via endpoint upload backend
    try {
      const formData = new FormData();
      formData.append("file", file);

      const token =
        localStorage.getItem("token") ||
        localStorage.getItem("accessToken") ||
        "";

      const res = await fetch(`${API_BASE_URL}/upload/image`, {
        method: "POST",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        const serverUrl = data.url || data.data?.url || "";
        if (serverUrl) {
          return serverUrl.startsWith("http")
            ? serverUrl
            : `${API_BASE_URL}${serverUrl.startsWith("/") ? "" : "/"}${serverUrl}`;
        }
      }
    } catch {
      // Fallback ke Object URL
    }

    // Jalur C: Fallback aman agar proses form dan preview tidak crash
    try {
      return URL.createObjectURL(file);
    } catch {
      // fallback
    }
  }

  return "";
}