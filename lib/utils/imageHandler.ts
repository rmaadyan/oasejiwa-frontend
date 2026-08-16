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

  // 🟢 1. JIKA FORMAT REGULER (JPG, PNG, WEBP, GIF, SVG)
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

  // 🟢 2. JIKA FORMAT HEIC DARI IPHONE
  if (typeof window !== "undefined") {
    // A. Coba decoder 'heic-to'
    try {
      const { heicTo } = await import("heic-to");
      const jpegBlob = await heicTo({
        blob: file,
        type: "image/jpeg",
        quality: 0.85,
      });

      if (jpegBlob) {
        return URL.createObjectURL(jpegBlob);
      }
    } catch {
      // Abaikan dan lanjut ke decoder berikutnya
    }

    // B. Coba decoder alternatif 'heic2any' (dengan parameter single object yang valid)
    try {
      const heic2anyModule = await import("heic2any");
      const heic2any = heic2anyModule.default || heic2anyModule;
      const converted = await heic2any({
        blob: file,
        toType: "image/jpeg",
        quality: 0.85,
      });

      const blobResult = Array.isArray(converted) ? converted[0] : converted;
      if (blobResult) {
        return URL.createObjectURL(blobResult);
      }
    } catch {
      // Abaikan jika client decode gagal
    }

    // C. Fallback: Upload langsung ke Backend VPS jika client decode browser tidak support
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
      // Abaikan kegagalan jaringan backend
    }

    // D. Safe Fallback Terakhir: Buat Blob URL langsung dari file asli agar UI tidak macet
    try {
      return URL.createObjectURL(file);
    } catch {
      // fallback
    }
  }

  throw new Error("Format gambar tidak dapat dibaca oleh browser.");
}