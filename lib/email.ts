export const POPULAR_DOMAINS = [
    "gmail.com", "yahoo.com", "hotmail.com", "outlook.com",
    "mail.com", "protonmail.com", "icloud.com", "aol.com",
    "zoho.com", "fastmail.com", "mailbox.org", "tutanota.com",
    "yandex.com", "rediff.com", "gmx.com",
    "yahoo.co.id", "yahoo.co.uk", "yahoo.co.jp",
    "outlook.co.id",
];

const ALLOWED_TLDS = [
    "com","org","net","edu","gov","mil",
    "co","io","id","us","uk","au","ca","de","fr","jp","sg",
    "info","biz","me","tv","dev","app","cloud",
    "web","store","online","site","tech","xyz",
];

export function validateEmail(email: string): string {
    if (!email.trim()) return "Email tidak boleh kosong";
    if (/\s/.test(email)) return "Email tidak boleh mengandung spasi";

    const atCount = (email.match(/@/g) || []).length;
    if (atCount === 0) return "Email harus mengandung '@'";
    if (atCount > 1) return "Email hanya boleh satu '@'";

    const [local, domain] = email.split("@");
    if (!local) return "Bagian sebelum '@' tidak boleh kosong";
    if (local.length > 64) return "Bagian sebelum '@' maksimal 64 karakter";
    if (local.startsWith(".") || local.endsWith("."))
        return "Bagian sebelum '@' tidak valid";
    if (!/^[a-zA-Z0-9._%+\-]+$/.test(local))
        return "Email mengandung karakter tidak valid";

    if (!domain || !domain.includes("."))
        return "Domain email tidak valid";

    const parts = domain.split(".");
    const tld = parts[parts.length - 1].toLowerCase();
    if (!ALLOWED_TLDS.includes(tld))
        return `TLD "${tld}" tidak dikenali`;

    if (!POPULAR_DOMAINS.includes(domain.toLowerCase()))
        return "Gunakan domain email yang umum (gmail, yahoo, dll)";

    return "";
}