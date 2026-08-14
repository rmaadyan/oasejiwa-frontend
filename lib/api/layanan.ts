<<<<<<< Updated upstream
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
=======
// 🟢 SANITASI API_BASE_URL (Perbaikan URL cacat, prefix /api, & trailing slash)
let rawUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

// Perbaiki jika ada URL cacat 'https:/' akibat environment variable
if (rawUrl.startsWith("https:/") && !rawUrl.startsWith("https://")) {
  rawUrl = rawUrl.replace("https:/", "https://");
}

export const API_BASE_URL = rawUrl.replace(/\/$/, "");

// 🟢 HELPER AMAN UNTUK PARSING JSON/TEXT
async function safeParseJson(res: Response, fallbackValue: any = null) {
  const text = await res.text();
  if (!text || text.trim() === "") return fallbackValue;
  try {
    return JSON.parse(text);
  } catch (err) {
    return fallbackValue;
  }
}
>>>>>>> Stashed changes

function mapBackendToLayananItem(raw: any) {
  return {
    id: raw.id,
    nama: raw.nama,
    jenis: raw.jenis,
    kategori: raw.kategori === "NonPaket" ? "Non Paket" : raw.kategori,
    deskripsi: raw.deskripsi ?? "",
    catatan: raw.catatan,
    durasiMenit: raw.durasiMenit,
    harga: raw.harga,
    status: raw.status,
    coverUrl: raw.gambar,
    urutan: raw.urutan ?? 0, // 🟢 posisi urutan dari backend
  };
}

function mapToBackendPayload(data: any) {
  return {
    nama: data.nama,
    jenis: data.jenis,
    kategori: data.kategori === "Non Paket" ? "NonPaket" : data.kategori,
    deskripsi: data.deskripsi,
    catatan: data.catatan || undefined,
    durasiMenit: data.durasiMenit,
    harga: data.harga,
    status: data.status,
    gambar: data.coverUrl || undefined,
    ...(data.urutan !== undefined ? { urutan: data.urutan } : {}), // 🟢 ikut dikirim kalau ada
  };
}

// 🟢 Sort helper: urutkan berdasarkan field urutan, fallback ke id kalau sama/kosong
function sortByUrutan(list: any[]) {
  return [...list].sort((a, b) => {
    const ua = a.urutan ?? 0;
    const ub = b.urutan ?? 0;
    if (ua !== ub) return ua - ub;
    return (a.id ?? 0) - (b.id ?? 0);
  });
}

export async function getAllLayanan() {
  const res = await fetch(`${API_BASE_URL}/layanan`, {
    cache: "no-store",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Gagal fetch data layanan");
<<<<<<< Updated upstream
  const data = await res.json();
  return data.map(mapBackendToLayananItem);
=======
  const data = await safeParseJson(res, []);
  const mapped = Array.isArray(data) ? data.map(mapBackendToLayananItem) : [];
  return sortByUrutan(mapped);
>>>>>>> Stashed changes
}

export async function getAllLayananPublic() {
  const res = await fetch(`${API_BASE_URL}/layanan`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Gagal fetch data layanan");
<<<<<<< Updated upstream
  const data = await res.json();
  return data.map(mapBackendToLayananItem);
=======
  const data = await safeParseJson(res, []);
  const mapped = Array.isArray(data) ? data.map(mapBackendToLayananItem) : [];
  return sortByUrutan(mapped);
>>>>>>> Stashed changes
}

export async function getLayananById(id: string) {
  const res = await fetch(`${API_BASE_URL}/layanan/${id}`, {
    cache: "no-store",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Gagal fetch layanan");
  const data = await res.json();
  return mapBackendToLayananItem(data);
}

export async function createLayanan(data: any) {
  const res = await fetch(`${API_BASE_URL}/layanan`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(mapToBackendPayload(data)),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const msg = Array.isArray(err.message) ? err.message.join(", ") : err.message;
    throw new Error(msg || "Gagal create layanan");
  }
  return res.json();
}

export async function updateLayanan(id: string, data: any) {
  const res = await fetch(`${API_BASE_URL}/layanan/${id}`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(mapToBackendPayload(data)),
  });
  if (!res.ok) throw new Error("Gagal update layanan");
  return res.json();
}

// 🟢 Simpan urutan baru untuk banyak layanan sekaligus.
// Karena backend belum punya endpoint bulk-reorder, kita kirim PATCH
// per-item secara paralel memakai updateLayanan yang sudah ada.
export async function reorderLayanan(items: { id: number; urutan: number }[]) {
  await Promise.all(
    items.map((item) =>
      fetch(`${API_BASE_URL}/layanan/${item.id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urutan: item.urutan }),
      }).then((res) => {
        if (!res.ok) throw new Error(`Gagal update urutan layanan id ${item.id}`);
        return safeParseJson(res, {});
      })
    )
  );
}

export async function uploadGambarLayanan(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(`${API_BASE_URL}/upload/image`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });
  if (!res.ok) throw new Error("Gagal upload gambar");
  const result = await res.json();
  return result.url;
}

export async function deleteLayanan(id: string) {
  const res = await fetch(`${API_BASE_URL}/layanan/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
<<<<<<< Updated upstream
  if (!res.ok) throw new Error("Gagal hapus layanan");
  return res.json();
}
=======

  if (!response.ok) {
    const errorData = await safeParseJson(response, {});
    throw new Error(errorData.message || `Gagal hapus layanan (Status: ${response.status})`);
  }

  return await safeParseJson(response, {});
}
>>>>>>> Stashed changes
