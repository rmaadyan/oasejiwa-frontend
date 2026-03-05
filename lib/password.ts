export const PASSWORD_RULES = [
    { label: "Minimal 8 karakter", test: (p: string) => p.length >= 8 },
    { label: "Maksimal 64 karakter", test: (p: string) => p.length <= 64 },
    { label: "Huruf kapital (A-Z)", test: (p: string) => /[A-Z]/.test(p) },
    { label: "Huruf kecil (a-z)", test: (p: string) => /[a-z]/.test(p) },
    { label: "Angka (0-9)", test: (p: string) => /[0-9]/.test(p) },
    { label: "Karakter khusus (!@#$%^&*)", test: (p: string) => /[!@#$%^&*]/.test(p) },
];

export function getPasswordRuleStatus(password: string) {
    return PASSWORD_RULES.map(rule => ({
        ...rule,
        passed: rule.test(password),
    }));
}

export function validatePassword(password: string): string {
    if (!password) return "Password tidak boleh kosong";

    const allPassed = PASSWORD_RULES.every(r => r.test(password));
    if (!allPassed) return "Password tidak memenuhi ketentuan";

    return "";
}