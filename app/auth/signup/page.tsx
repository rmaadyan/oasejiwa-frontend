'use client'
import React, {useState, useEffect} from "react";
import AuthLayout from "@/components/features/user/authLayout";
import FormField from "@/components/common/formField";
import GenderSelect from "@/components/features/user/genderSelect";
import {useRouter} from "next/navigation";
import CustomCalendar from "@/components/common/calendar";
import { useAuthValidation } from "@/hooks/use-auth-validation";
import { validatePhone } from "@/lib/phone";

export default function SignUp(){
    const [name, setName] = useState("");
    const [telephone, setTelephone] = useState("");
    const [email, setEmail] = useState("");
    const [date, setDate] = useState("");
    const [gender, setGender] = useState<"male" | "female">("male");
    const [address, setAddress] = useState("");
    const [password, setPassword] = useState("");
    const [nameError, setNameError] = useState("");
    const [telephoneError, setTelephoneError] = useState("");
    const [addressError, setAddressError] = useState("");
    const router = useRouter();
    const [birthDate, setBirthDate] = useState("");
    const [birthDateError, setBirthDateError] = useState("");

    const {
        emailError,
        passwordError,
        setEmailError,
        setPasswordError,
        validate,
        getPasswordRuleStatus,
    } = useAuthValidation();

    useEffect(() => {
        setName("");
        setTelephone("");
        setEmail("");
        setDate("");
        setGender("male");
        setAddress("");
        setPassword("");
    }, []);

    const passwordRuleStatus = getPasswordRuleStatus(password);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setNameError("");
        setTelephoneError("");
        setEmailError("");
        setAddressError("");
        setPasswordError("");

        let hasError = false;

        if (!name.trim()) {
            setNameError("Nama lengkap harus diisi");
            hasError = true;
        }

        if (!birthDate) {
            setBirthDateError("Tanggal lahir wajib diisi");
            hasError = true;
        }

        const phoneError = validatePhone(telephone);
        if (phoneError) {
            setTelephoneError(phoneError);
            hasError = true;
        }

        if (!address.trim()) {
            setAddressError("Alamat harus diisi");
            hasError = true;
        }

        const isAuthValid = validate(email, password);
        if (!isAuthValid) hasError = true;

        if (hasError) return;

        setTimeout(() => {
            router.replace('/userprofile');
        }, 500);
    };

    return(
        <div>
            <AuthLayout
            title="Welcome!"
            description="Create new account"
            >
                <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                        <FormField
                        label="Full Name"
                        id="name"
                        name="name"
                        type="text"  
                        value={name}
                        placeholder="Your full name"
                        onChange={setName}
                        error={nameError}
                        onClearError={() => setNameError("")}
                        ></FormField>

                        <div className="flex w-full flex-col gap-6">
                            <div>
                                <label className="block text-sm font-bold text-blue-950 mb-2">
                                    Birthday
                                </label>
                                <CustomCalendar
                                value={birthDate}
                                onChange={(val) => {
                                    setBirthDate(val);
                                    setBirthDateError("");
                                }}
                                error={birthDateError}
                                placeholder="Pilih tanggal lahir"
                                className="text-gray-700"
                                />
                            </div>

                            <GenderSelect
                            value={gender}
                            onChange={setGender}
                            ></GenderSelect>
                        </div>

                        <FormField
                        label="Address"
                        id="address"
                        name="address"
                        type="textarea"
                        value={address}
                        placeholder="your address"
                        onChange={setAddress}
                        error={addressError}
                        onClearError={() => setAddressError("")}
                        ></FormField>

                        <FormField
                        label="WhatsApp"
                        id="whatsapp"
                        name="number"
                        type="tel"
                        value={telephone}
                        placeholder="+62"
                        onChange={(val) => {
                            const clean = val.replace(/\D/g, "");
                            setTelephone(clean);
                            setTelephoneError(""); 
                        }}
                        error={telephoneError}
                        onClearError={() => setTelephoneError("")}
                        ></FormField>

                        <FormField
                        label="Email"
                        id="email"
                        name="email"
                        type="text"  
                        autoComplete="email"
                        value={email}
                        placeholder="your@gmail.com"
                        onChange={setEmail}
                        error={emailError}
                        onClearError={() => setEmailError("")}
                        ></FormField>

                        <FormField
                        label="Password"
                        id="password"
                        name="password"
                        type="password"  
                        autoComplete="new-password"  
                        value={password}
                        placeholder="••••••••"
                        onChange={setPassword}
                        isPassword={true}
                        enableToggle={true}
                        error={passwordError}
                        onClearError={() => setPasswordError("")}
                        passwordRules={password.length > 0 ? passwordRuleStatus : undefined}
                    />

                        <div className="w-full max-w-xl flex flex-col justify-center mt-8">
                            <button type="submit" className="font-bold text-white bg-blue-900 w-full py-2 border border-blue-900 rounded-2xl hover:bg-blue-800 hover:shadow cursor-pointer">Save</button>
                        </div>
                    </div>
                </form>
            </AuthLayout>
        </div>
    );
} 