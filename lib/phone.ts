export function validatePhone(phone: string): string {
    if (!phone.trim()) return "Nomor WhatsApp harus diisi";

    const clean = phone.replace(/\s/g, "");

    if (!/^\+?[0-9]{10,15}$/.test(clean)) {
        return "Format nomor tidak valid (10–15 digit)";
    }

    return "";
}