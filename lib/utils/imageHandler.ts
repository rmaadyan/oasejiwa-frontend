let rawUrl =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "https://api.oasejiwa.id";

if (rawUrl.startsWith("https:/") && !rawUrl.startsWith("https://")) {
  rawUrl = rawUrl.replace("https:/", "https://");
}
const API_BASE_URL = rawUrl.replace(/\/$/, "");

export async function processSelectedImage(file: File): Promise<string> {
  const fileName = (file.name || "").toLowerCase();
  const fileType = (file.type || "").toLowerCase();

  const isHeic =
    fileType === "image/heic" ||
    fileType === "image/heif" ||
    fileType.includes("hei") ||
    fileName.endsWith(".heic") ||
    fileName.endsWith(".heif");

  // 1. Jika Gambar Biasa (JPG, PNG, WebP, GIF)
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

  // 2. Jika Gambar Format HEIC (iPhone)
  if (typeof window !== "undefined") {
    // Jalur A: Coba decode client heic-to
    try {
      const { heicTo } = await import("heic-to");
      const jpegBlob = await heicTo({
        blob: file,
        type: "image/jpeg",
        quality: 0.9,
      });

      if (jpegBlob) {
        return URL.createObjectURL(jpegBlob);
      }
    } catch (err) {
      console.warn("Client heic-to gagal, mengalihkan ke endpoint upload backend...", err);
    }

    // Jalur B: Fallback Backend Upload (Langsung jadikan URL JPG aman agar canvas crop tidak hitam)
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
    } catch (serverErr) {
      console.warn("Fallback upload backend gagal:", serverErr);
    }

    // Jalur C: Fallback Blob Asli
    try {
      return URL.createObjectURL(file);
    } catch {
      // ignore
    }
  }

  throw new Error("Format gambar ini tidak dapat dibaca oleh browser. Gunakan format JPG atau PNG.");
}