const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://api.oasejiwa.id";

export async function getAllPsychologists() {
  const res = await fetch(`${API_BASE_URL}/admin/psychologists`, {
    credentials: "include",
  });

  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Gagal mengambil data psikolog");

  return result;
}

export async function getPsychologistById(id: string) {
  const res = await fetch(`${API_BASE_URL}/admin/psychologists/${id}`, {
    credentials: "include",
  });

  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Psikolog tidak ditemukan");

  return result;
}

export async function createPsychologist(data: any, avatarFile?: File) {
  const formData = buildFormData(data, avatarFile);

  const res = await fetch(`${API_BASE_URL}/admin/psychologists`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  const result = await res.json();

  if (!res.ok) {
    const msg = Array.isArray(result.message)
      ? result.message.join(", ")
      : result.message;

    throw new Error(msg);
  }

  return result;
}

export async function updatePsychologist(
  id: string,
  data: any,
  avatarFile?: File
) {
  const formData = buildFormData(data, avatarFile);

  const res = await fetch(`${API_BASE_URL}/admin/psychologists/${id}`, {
    method: "PATCH",
    credentials: "include",
    body: formData,
  });

  const result = await res.json();

  if (!res.ok) {
    const msg = Array.isArray(result.message)
      ? result.message.join(", ")
      : result.message;

    throw new Error(msg);
  }

  return result;
}

export async function deletePsychologist(id: string) {
  const res = await fetch(`${API_BASE_URL}/admin/psychologists/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Gagal hapus psikolog");

  return result;
}

function buildFormData(data: any, avatarFile?: File): FormData {
  const formData = new FormData();
  formData.append("data", JSON.stringify(data));

  if (avatarFile) {
    formData.append("avatar", avatarFile);
  }

  return formData;
}