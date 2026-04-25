import { useState } from "react";
import { validateEmail } from "@/lib/email";
import {
    validatePassword,
    getPasswordRuleStatus,
} from "@/lib/password";

export function useAuthValidation() {
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const validate = (email: string, password: string) => {
        const emailErr = validateEmail(email);
        const passErr = validatePassword(password);

        setEmailError(emailErr);
        setPasswordError(passErr);

        return !emailErr && !passErr;
    };

    const validatePasswordOnly = (password: string) => {
        const passErr = validatePassword(password);
        setPasswordError(passErr);
        return !passErr;
    };

    return {
        emailError,
        passwordError,
        setEmailError,
        setPasswordError,
        validate,
        validatePasswordOnly,
        getPasswordRuleStatus,
    };
}

export function validateLogin(email: string, password: string) {
    if (!email) return "Email tidak boleh kosong";
    if (!password) return "Password tidak boleh kosong";
    return "";
}