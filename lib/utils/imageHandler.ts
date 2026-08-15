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
    fileType.includes("hei") ||
    fileName.endsWith(".heic") ||
    fileName.endsWith(".heif");

  // 🟢 1. JIKA FORMAT REGULER (JPG, PNG, WEBP, GIF)
  if (!isHeic) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => resolve(URL.createObjectURL(file));
      reader.readAsDataURL(file);
    });
  }

  // 🟢 2. JIKA FORMAT HEIC: Coba decode di browser dengan heic-to
  if (typeof window !== "undefined") {
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
    } catch (clientErr) {
      console.warn("Client decode heic-to gagal, mengalihkan ke backend server...", clientErr);
    }

    // 🟢 3. FALLBACK SERVER (Upload langsung ke server backend untuk dikonversi menjadi JPG)
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
      console.error("Gagal konversi gambar via server:", serverErr);
    }
  }

  throw new Error("Format gambar ini tidak dapat dibaca oleh browser.");
}