const rawUrl = (process.env.NEXT_PUBLIC_API_URL || "https://api.oasejiwa.id")
  .replace(/\/api\/?$/, "")
  .replace(/\/+$/, "");
const API_BASE_URL = rawUrl || "https://api.oasejiwa.id";

function getAuthToken(): string {
  if (typeof window !== "undefined") {
    return (
      localStorage.getItem("auth_token") ||
      localStorage.getItem("accessToken") ||
      localStorage.getItem("token") ||
      ""
    );
  }
  return "";
}

// Konversi response backend ke format frontend
function mapBackendToTesItem(raw: any) {
  const sectionKategoriMap: Record<string, any[]> = {};
  for (const s of raw.sectionKategori ?? []) {
    if (!sectionKategoriMap[s.sectionNama]) {
      sectionKategoriMap[s.sectionNama] = [];
    }
    sectionKategoriMap[s.sectionNama].push({
      id: s.id,
      nama: s.nama,
      minSkor: s.minSkor,
      maxSkor: s.maxSkor,
      deskripsi: s.deskripsi,
    });
  }

  return {
    id: raw.id,
    nama: raw.nama,
    jumlah: raw.jumlah,
    status: raw.status,
    deskripsi: raw.deskripsi,
    penjelasanHasil: raw.penjelasanHasil,
    jenis: raw.jenis,
    coverUrl: raw.coverUrl,
    pertanyaan: raw.pertanyaan ?? [],
    likert: raw.likertOptions ?? [],
    kategori: raw.kategori ?? [],
    sectionKategori: Object.keys(sectionKategoriMap).length > 0
      ? sectionKategoriMap
      : undefined,
  };
}

// GET: Semua Tes
export async function getAllTes() {
  const token = getAuthToken();
  const res = await fetch(`${API_BASE_URL}/tes`, {
    cache: "no-store",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) throw new Error("Gagal fetch data tes");
  const data = await res.json();
  return data.map(mapBackendToTesItem);
}

// GET: Tes by ID
export async function getTesById(id: string) {
  const token = getAuthToken();
  const res = await fetch(`${API_BASE_URL}/tes/${id}`, {
    cache: "no-store",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) throw new Error("Gagal fetch tes");
  const data = await res.json();
  return mapBackendToTesItem(data);
}

// POST: Buat Tes Baru
export async function createTes(data: any) {
  const token = getAuthToken();
  const { jumlah, ...payload } = data; 
  const res = await fetch(`${API_BASE_URL}/tes`, {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Gagal create tes");
  return res.json();
}

// PATCH: Update Tes
export async function updateTes(id: string, data: any) {
  const token = getAuthToken();
  const res = await fetch(`${API_BASE_URL}/tes/${id}`, {
    method: "PATCH",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Gagal update tes");
  return res.json();
}

// DELETE: Hapus Tes
export async function deleteTes(id: string) {
  const token = getAuthToken();
  const res = await fetch(`${API_BASE_URL}/tes/${id}`, {
    method: "DELETE",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) throw new Error("Gagal delete tes");
  return res.json();
}

export async function uploadGambar(file: File): Promise<string> {
  const token = getAuthToken();
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE_URL}/upload/image`, {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  if (!res.ok) throw new Error("Gagal upload gambar");
  const data = await res.json();
  return data.url;
}

function authFetch(url: string, options: RequestInit = {}) {
  const token = getAuthToken();
  return fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
}

export async function submitTesResult(tesId: string | number, payload: any) {
  try {
    const token = getAuthToken();
    if (!token) {
      // User is Guest (not logged in). Do not invoke authenticated backend submit endpoint.
      return { guest: true, success: true };
    }

    const res = await authFetch(`${API_BASE_URL}/tes/${tesId}/submit`, {
      method: "POST",
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.error(`Gagal submit tes result ke backend status: ${res.status}`, errText);
      return null;
    }
    return await res.json();
  } catch (err) {
    console.error("Error submit tes result:", err);
    return null;
  }
}

export async function getUserTesResults(userId: string) {
  try {
    const res = await authFetch(`${API_BASE_URL}/tes/results/user/${userId}`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    console.error("Error fetching user tes results:", err);
    return [];
  }
}

export async function getMyTesResults() {
  try {
    const res = await authFetch(`${API_BASE_URL}/tes/results/my-results`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    console.error("Error fetching my tes results:", err);
    return [];
  }
}

export async function getAllTesResults() {
  try {
    const res = await authFetch(`${API_BASE_URL}/tes/results/all`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    console.error("Error fetching all tes results:", err);
    return [];
  }
}

export async function getTesResultDetail(id: string) {
  try {
    const res = await authFetch(`${API_BASE_URL}/tes/results/detail/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error("Error fetching tes result detail:", err);
    return null;
  }
}
