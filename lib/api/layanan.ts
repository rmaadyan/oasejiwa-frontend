
let rawUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.oasejiwa.id";

if (rawUrl.startsWith("https:/") && !rawUrl.startsWith("https://")) {
  rawUrl = rawUrl.replace("https:/", "https://");
}

export const API_BASE_URL = rawUrl.replace(/\/$/, "");

async function safeParseJson(res: Response, fallbackValue: any = null) {
  const text = await res.text();
  if (!text || text.trim() === "") return fallbackValue;
  try {
    return JSON.parse(text);
  } catch {
    return fallbackValue;
  }
}

function mapBackendToLayananItem(raw: any) {
  if (!raw) return {} as any;
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
    urutan: Number(raw.urutan ?? 0),
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
    ...(data.urutan !== undefined ? { urutan: data.urutan } : {}),
  };
}

function sortByUrutan(list: any[]) {
  return [...list].sort((a, b) => {
    const ua = Number(a.urutan ?? 0);
    const ub = Number(b.urutan ?? 0);
    if (ua !== ub) return ua - ub;
    return (a.id ?? 0) - (b.id ?? 0);
  });
}

// 🟢 GET ALL LAYANAN (DENGAN ANTI-CACHE REALTIME)
export async function getAllLayanan() {
  const res = await fetch(`${API_BASE_URL}/layanan?t=${Date.now()}`, {
    cache: "no-store",
    credentials: "include",
    headers: {
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
    },
  });
  if (!res.ok) throw new Error("Gagal fetch data layanan");
  const data = await safeParseJson(res, []);
  const mapped = Array.isArray(data) ? data.map(mapBackendToLayananItem) : [];
  return sortByUrutan(mapped);
}

export async function getAllLayananPublic() {
  const res = await fetch(`${API_BASE_URL}/layanan?t=${Date.now()}`, {
    cache: "no-store",
    headers: {
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
    },
  });
  if (!res.ok) throw new Error("Gagal fetch data layanan");
  const data = await safeParseJson(res, []);
  const mapped = Array.isArray(data) ? data.map(mapBackendToLayananItem) : [];
  return sortByUrutan(mapped);
}

export async function getLayananById(id: string) {
  const res = await fetch(`${API_BASE_URL}/layanan/${id}?t=${Date.now()}`, {
    cache: "no-store",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Gagal fetch layanan");
  const data = await safeParseJson(res, null);
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
    const err = await safeParseJson(res, {});
    const msg = Array.isArray(err.message) ? err.message.join(", ") : err.message;
    throw new Error(msg || "Gagal create layanan");
  }
  return await safeParseJson(res, {});
}

export async function updateLayanan(id: string, data: any) {
  const res = await fetch(`${API_BASE_URL}/layanan/${id}`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(mapToBackendPayload(data)),
  });
  if (!res.ok) throw new Error("Gagal update layanan");
  return await safeParseJson(res, {});
}

export async function reorderLayanan(items: any[]) {
  await Promise.all(items.map((item) => updateLayanan(String(item.id), item)));
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
  const result = await safeParseJson(res, {});
  return result.url || "";
}

export async function deleteLayanan(id: number) {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const response = await fetch(`${API_BASE_URL}/layanan/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  if (!response.ok) {
    const errorData = await safeParseJson(response, {});
    throw new Error(errorData.message || `Gagal hapus layanan (Status: ${response.status})`);
  }

  return await safeParseJson(response, {});
}