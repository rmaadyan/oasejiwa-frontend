const API_BASE_URL = "http://localhost:3001";

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
  };
}

export async function getAllLayanan() {
  const res = await fetch(`${API_BASE_URL}/layanan`, {
    cache: "no-store",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Gagal fetch data layanan");
  const data = await res.json();
  return data.map(mapBackendToLayananItem);
}

export async function getAllLayananPublic() {
  const res = await fetch(`${API_BASE_URL}/layanan`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Gagal fetch data layanan");
  const data = await res.json();
  return data.map(mapBackendToLayananItem);
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
  if (!res.ok) throw new Error("Gagal hapus layanan");
  return res.json();
}