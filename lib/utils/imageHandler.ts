export async function processSelectedImage(file: File): Promise<string> {
  const fileName = file.name.toLowerCase();
  const fileType = file.type.toLowerCase();

  const isHeic =
    fileType === "image/heic" ||
    fileType === "image/heif" ||
    fileType === "" || // Beberapa browser mendeteksi HEIC dengan MIME kosong
    fileName.endsWith(".heic") ||
    fileName.endsWith(".heif");

  // 🟢 1. Tangani Format HEIC (iPhone)
  if (isHeic && (fileName.endsWith(".heic") || fileName.endsWith(".heif") || fileType.includes("hei"))) {
    try {
      const heic2anyPkg = await import("heic2any");
      const heic2any = heic2anyPkg.default || heic2anyPkg;

      // Konversi File ke ArrayBuffer -> Blob murni
      const arrayBuffer = await file.arrayBuffer();
      const rawBlob = new Blob([arrayBuffer]);

      const conversionResult = await heic2any({
        blob: rawBlob,
        toType: "image/jpeg",
        quality: 0.85,
      });

      const singleBlob = Array.isArray(conversionResult)
        ? conversionResult[0]
        : conversionResult;

      // Pastikan type jpeg terpasang valid
      const finalJpegBlob = new Blob([singleBlob], { type: "image/jpeg" });
      return URL.createObjectURL(finalJpegBlob);
    } catch (err) {
      console.error("Gagal decode HEIC:", err);
      throw new Error("Gagal memproses format foto HEIC. Pastikan file tidak rusak atau gunakan format JPG/PNG.");
    }
  }

  // 🟢 2. Format Reguler (JPG, PNG, WEBP)
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