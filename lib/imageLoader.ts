/**
 * Centralized image loader untuk semua gambar di project
 * Mendukung hero, service, testimonial, about, dan gambar lainnya
 */

// ============================================
// BASE PATH - Semua gambar landing page
// ============================================

const LANDINGPAGE_PATH = "/assets/landingpage";

// ============================================
// HERO IMAGES
// ============================================

const KNOWN_HERO_IMAGES = [
  "gambar.jpg",
  "gambar1.jpg",
  "gambar2.jpg",
  "gambar3.JPG",
  "gambar4.JPG",
];

/**
 * Load semua gambar dari folder landingpage untuk hero
 */
export async function loadBgheroImages(): Promise<string[]> {
  try {
    return KNOWN_HERO_IMAGES.map(filename => `${LANDINGPAGE_PATH}/${filename}`);
  } catch (error) {
    console.error("Error loading bghero images:", error);
    return [`${LANDINGPAGE_PATH}/gambar.jpg`];
  }
}

// ============================================
// ABOUT IMAGES
// ============================================

export const aboutImages: string[] = [
  `${LANDINGPAGE_PATH}/IMG_4500.jpg`,
  `${LANDINGPAGE_PATH}/IMG_4501.jpg`,
  `${LANDINGPAGE_PATH}/IMG_4507.jpg`,
];

// ============================================
// SERVICE IMAGES (menggunakan gambar yang sama untuk sementara)
// ============================================

const KNOWN_SERVICE_IMAGES = [
  "IMG_4500.jpg",
  "IMG_4501.jpg",
  "IMG_4507.jpg",
  "gambar.jpg",
  "gambar1.jpg",
  "gambar2.jpg",
  "gambar3.JPG",
  "gambar4.JPG",
];

/**
 * Load gambar-gambar untuk service
 */
export const bgServiceImages: string[] = KNOWN_SERVICE_IMAGES.map(
  (filename) => `${LANDINGPAGE_PATH}/${filename}`
);

/**
 * Helper untuk mendapatkan gambar service berdasarkan index
 * Auto loop jika index melebihi jumlah gambar
 */
export function getServiceImage(index: number): string {
  return bgServiceImages[index % bgServiceImages.length];
}

// ============================================
// TESTIMONIAL IMAGES (menggunakan gambar yang tersedia)
// ============================================

const KNOWN_TESTIMONI_IMAGES = [
  "IMG_4500.jpg",
  "IMG_4501.jpg",
  "IMG_4507.jpg",
];

/**
 * Load gambar-gambar untuk testimonial
 */
export const bgTestimoniImages: string[] = KNOWN_TESTIMONI_IMAGES.map(
  (filename) => `${LANDINGPAGE_PATH}/${filename}`
);

/**
 * Helper untuk mendapatkan gambar testimonial berdasarkan index
 * Auto loop jika index melebihi jumlah gambar
 */
export function getTestimoniImage(index: number): string {
  return bgTestimoniImages[index % bgTestimoniImages.length];
}

// ============================================
// VERIFICATION
// ============================================

/**
 * Verifikasi apakah gambar bisa diload
 */
export async function verifyImage(imagePath: string): Promise<boolean> {
  try {
    const response = await fetch(imagePath, { method: "HEAD" });
    return response.ok;
  } catch {
    return false;
  }
}

