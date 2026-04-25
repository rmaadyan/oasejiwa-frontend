export const PASSWORD_RULES = [
    { 
        label: "Minimal 8 karakter", 
        test: (p: string) => p.length >= 8,
        required: true
    },
    { 
        label: "Maksimal 64 karakter", 
        test: (p: string) => p.length <= 64,
        required: true
    },
    { 
        label: "Disarankan kombinasi huruf & angka", 
        test: (p: string) => /[a-zA-Z]/.test(p) && /[0-9]/.test(p),
        required: false 
    },
];

export function getPasswordRuleStatus(password: string) {
    return PASSWORD_RULES.map(rule => ({
        ...rule,
        passed: rule.test(password),
    }));
}

export function validatePassword(password: string): string {
    if (!password) return "Password tidak boleh kosong";

    const requiredRules = PASSWORD_RULES.filter(r => r.required);

    const allPassed = requiredRules.every(r => r.test(password));
    if (!allPassed) return "Password tidak memenuhi ketentuan";

    return "";
}