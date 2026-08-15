export async function processSelectedImage(file: File): Promise<string> {
  const fileName = file.name.toLowerCase();
  const fileType = file.type.toLowerCase();

  const isHeic =
    fileType === "image/heic" ||
    fileType === "image/heif" ||
    fileType.includes("hei") ||
    fileName.endsWith(".heic") ||
    fileName.endsWith(".heif");

  // 🟢 1. Coba render langsung (Untuk iPhone / Mac / Safari yang sudah mendukung HEIC secara native)
  if (isHeic) {
    try {
      const nativeUrl = URL.createObjectURL(file);
      const canRenderNatively = await testImageRendering(nativeUrl);
      if (canRenderNatively) {
        return nativeUrl;
      }
    } catch {
      // Jika browser tidak bisa render langsung, lanjutkan ke heic2any converter di bawah
    }

    // 🟢 2. Konversi menggunakan heic2any untuk Windows / Chrome / Android
    try {
      const heic2anyModule = await import("heic2any");
      const heic2any = heic2anyModule.default || heic2anyModule;

      // Beri tipe MIME eksplisit "image/heic" agar tidak ditolak di Windows
      const heicBlob = new Blob([file], { type: "image/heic" });

      const conversionResult = await heic2any({
        blob: heicBlob,
        toType: "image/jpeg",
        quality: 0.85,
      });

      const singleBlob = Array.isArray(conversionResult)
        ? conversionResult[0]
        : conversionResult;

      return URL.createObjectURL(singleBlob);
    } catch (err: any) {
      console.error("Detail error konversi HEIC:", err);
      throw new Error(
        "Gagal memproses file HEIC. Silakan gunakan format JPG, PNG, atau ubah pengaturan kamera HP ke Most Compatible (JPEG)."
      );
    }
  }

  // 🟢 3. Format Normal (JPG, PNG, WEBP)
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

// Helper untuk mengecek apakah browser bisa membuka gambar secara native
function testImageRendering(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
}