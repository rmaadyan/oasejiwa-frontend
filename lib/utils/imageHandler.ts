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

  // 🟢 1. JIKA BUKAN HEIC (JPG, PNG, WEBP, GIF) -> Baca instan
  if (!isHeic) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => resolve(URL.createObjectURL(file));
      reader.readAsDataURL(file);
    });
  }

  // 🟢 2. JIKA HEIC: Coba decode di browser client (heic2any)
  if (typeof window !== "undefined") {
    try {
      const heic2anyPkg = await import("heic2any");
      const heic2any = heic2anyPkg.default || heic2anyPkg;

      const conversionResult = await heic2any({
        blob: file,
        toType: "image/jpeg",
        quality: 0.85,
      });

      const blob = Array.isArray(conversionResult)
        ? conversionResult[0]
        : conversionResult;

      return URL.createObjectURL(blob);
    } catch {
      console.warn("Client HEIC decode gagal, beralih ke upload server konversi...");
    }

    // 🟢 3. FALLBACK SERVER (Untuk format Apple HDR 10-bit yang ditolak decoder browser)
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
      console.error("Server fallback gagal:", serverErr);
    }
  }

  // 🟢 4. Fallback URL Objek
  return URL.createObjectURL(file);
}