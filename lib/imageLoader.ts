/**
 * Centralized image loader untuk semua gambar di project
 * Mendukung hero, service, testimonial, about, dan gambar lainnya
 */

// ============================================
// HERO IMAGES
// ============================================

const BGHERO_PATH = "/bghero";

const KNOWN_HERO_IMAGES = [
  "gambar.jpg",
  "gambar1.jpg",
  "gambar2.jpg",
  "gambar3.JPG",
];

/**
 * Load semua gambar dari folder bghero
 */
export async function loadBgheroImages(): Promise<string[]> {
  try {
    return KNOWN_HERO_IMAGES.map(filename => `${BGHERO_PATH}/${filename}`);
  } catch (error) {
    console.error("Error loading bghero images:", error);
    return [`${BGHERO_PATH}/gambar.jpg`];
  }
}

// ============================================
// ABOUT IMAGES
// ============================================

const ABOUT_PATH = "/about";

export const aboutImages: string[] = [
  `${ABOUT_PATH}/1.jpg`,
  `${ABOUT_PATH}/2.jpg`,
  `${ABOUT_PATH}/3.jpg`,
];

// ============================================
// SERVICE IMAGES
// ============================================

const BGSERVICE_PATH = "/bgservice";

const KNOWN_SERVICE_IMAGES = [
  "service1.jpg",
  "service2.jpg",
  "service3.jpg",
  "service4.jpg",
  "service5.jpg",
  "service6.jpg",
  "service7.jpg",
  "service8.jpg",
  "service9.jpg",
  "service10.jpg",
  "service11.jpg",
  "service12.jpg",
  "service13.jpg",
];

/**
 * Load gambar-gambar dari folder bgservice
 */
export const bgServiceImages: string[] = KNOWN_SERVICE_IMAGES.map(
  (filename) => `${BGSERVICE_PATH}/${filename}`
);

/**
 * Helper untuk mendapatkan gambar service berdasarkan index
 * Auto loop jika index melebihi jumlah gambar
 */
export function getServiceImage(index: number): string {
  return bgServiceImages[index % bgServiceImages.length];
}

// ============================================
// TESTIMONIAL IMAGES
// ============================================

const BGTESTIMONI_PATH = "/bgtestimoni";

const KNOWN_TESTIMONI_IMAGES = [
  "testimoni1.jpg",
  "testimoni2.jpg",
  "testimoni3.jpg",
  "testimoni4.jpg",
  "testimoni5.jpg",
];

/**
 * Load gambar-gambar dari folder bgtestimoni
 */
export const bgTestimoniImages: string[] = KNOWN_TESTIMONI_IMAGES.map(
  (filename) => `${BGTESTIMONI_PATH}/${filename}`
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

