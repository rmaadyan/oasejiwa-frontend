export async function processSelectedImage(file: File): Promise<string> {
  const fileName = file.name.toLowerCase();
  const fileType = file.type.toLowerCase();

  const isHeic =
    fileType === "image/heic" ||
    fileType === "image/heif" ||
    fileName.endsWith(".heic") ||
    fileName.endsWith(".heif");

  // 🟢 Jika format HEIC/HEIF (iPhone / Kamera Modern)
  if (isHeic && typeof window !== "undefined") {
    try {
      const heic2anyModule = await import("heic2any");
      const heic2any = heic2anyModule.default || heic2anyModule;

      // Konversi buffer HEIC menjadi Blob JPEG murni
      const conversionResult = await heic2any({
        blob: file,
        toType: "image/jpeg",
        quality: 0.85,
      });

      const blob = Array.isArray(conversionResult)
        ? conversionResult[0]
        : conversionResult;

      return URL.createObjectURL(blob);
    } catch (err) {
      console.error("Gagal melakukan konversi HEIC via heic2any:", err);
      throw new Error("Format foto HEIC tidak dapat dibaca. Silakan gunakan format JPG atau PNG.");
    }
  }

  // 🟢 Untuk format standar (JPG, PNG, WEBP, GIF)
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Gagal membaca file gambar"));
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}