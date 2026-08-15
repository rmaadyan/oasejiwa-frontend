import { API_BASE_URL } from "@/lib/api/psychologist";

export async function processSelectedImage(file: File): Promise<string> {
  const fileName = file.name.toLowerCase();
  const fileType = file.type.toLowerCase();

  const isHeic =
    fileType === "image/heic" ||
    fileType === "image/heif" ||
    fileType.includes("hei") ||
    fileName.endsWith(".heic") ||
    fileName.endsWith(".heif");

  // 1. Jika bukan HEIC, baca langsung via DataURL
  if (!isHeic) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => resolve(URL.createObjectURL(file));
      reader.readAsDataURL(file);
    });
  }

  // 2. Cek apakah browser HP bisa render file ini secara langsung (Native ObjectURL)
  const localUrl = URL.createObjectURL(file);
  const canRenderDirectly = await testImageElement(localUrl);
  if (canRenderDirectly) {
    return localUrl;
  }

  // 3. Coba konversi via heic2any
  try {
    const heic2anyModule = await import("heic2any");
    const heic2any = heic2anyModule.default || heic2anyModule;

    const conversionResult = await heic2any({
      blob: file,
      toType: "image/jpeg",
      quality: 0.85,
    });

    const blob = Array.isArray(conversionResult) ? conversionResult[0] : conversionResult;
    return URL.createObjectURL(blob);
  } catch (err) {
    console.warn("Client decoding gagal, mencoba fallback upload server...", err);
  }

  // 4. Fallback: Upload ke server untuk konversi otomatis tanpa memunculkan alert error
  try {
    const formData = new FormData();
    formData.append("file", file);

    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("token") || localStorage.getItem("accessToken") || ""
        : "";

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
        return serverUrl.startsWith("http") ? serverUrl : `${API_BASE_URL}${serverUrl}`;
      }
    }
  } catch (serverErr) {
    console.warn("Server fallback failed:", serverErr);
  }

  // 5. Fallback terakhir: Kembalikan Object URL lokal agar UI cropper tetap terbuka
  return localUrl;
}

function testImageElement(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
}