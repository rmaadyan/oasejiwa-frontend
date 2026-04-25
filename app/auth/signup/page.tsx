'use client'
import React, { useState, useEffect } from "react";
import AuthLayout from "@/components/features/user/authLayout";
import FormField from "@/components/common/formField";
import GenderSelect from "@/components/features/user/genderSelect";
import { useRouter } from "next/navigation";
import CustomCalendar from "@/components/common/calendar";
import { useAuthValidation } from "@/hooks/use-auth-validation";
import { validatePhone } from "@/lib/phone";
import { registerUser } from "@/lib/api/auth"; 
import VerifyEmailModal from "@/components/common/VerifyEmailModal";

export default function SignUp() {
    const [name, setName] = useState("");
    const [telephone, setTelephone] = useState("");
    const [email, setEmail] = useState("");
    const [gender, setGender] = useState<"MALE" | "FEMALE">("MALE");
    const [address, setAddress] = useState("");
    const [country, setCountry] = useState("");  
    const [city, setCity] = useState("");         
    const [password, setPassword] = useState("");
    const [birthDate, setBirthDate] = useState("");

    const [nameError, setNameError] = useState("");
    const [telephoneError, setTelephoneError] = useState("");
    const [addressError, setAddressError] = useState("");
    const [countryError, setCountryError] = useState("");
    const [cityError, setCityError] = useState("");     
    const [birthDateError, setBirthDateError] = useState("");
    const [submitError, setSubmitError] = useState("");    
    const [isLoading, setIsLoading] = useState(false);    
    const [showVerifyModal, setShowVerifyModal] = useState(false);
    const [registeredEmail, setRegisteredEmail] = useState("");
    const router = useRouter();

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
        setGender("MALE");
        setAddress("");
        setCountry("");
        setCity("");
        setPassword("");
    }, []);

    const passwordRuleStatus = getPasswordRuleStatus(password);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Reset semua error
        setNameError("");
        setTelephoneError("");
        setEmailError("");
        setAddressError("");
        setPasswordError("");
        setCountryError("");
        setCityError("");
        setBirthDateError("");
        setSubmitError("");

        let hasError = false;

        if (!name.trim()) {
            setNameError("Nama lengkap harus diisi");
            hasError = true;
        }

        if (!birthDate) {
            setBirthDateError("Tanggal lahir wajib diisi");
            hasError = true;
        }

        if (!country.trim()) {
            setCountryError("Negara harus diisi");
            hasError = true;
        }

        if (!city.trim()) {
            setCityError("Kota harus diisi");
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

        // Kirim ke backend
        try {
            setIsLoading(true);

            await registerUser({
                fullName: name,
                birthday: birthDate,           
                gender: gender.toUpperCase() as "MALE" | "FEMALE",
                country,
                city,
                fullAddress: address,
                phone: telephone,
                email,
                password,
            });
            setRegisteredEmail(email)
            setShowVerifyModal(true);

        } catch (err: unknown) {
            if (err instanceof Error) {
                if (err.message.includes("Email sudah terdaftar")) {
                    setEmailError("Email sudah terdaftar, silakan gunakan email lain");
                } else {
                    setSubmitError(err.message);
                }
            } else {
                setSubmitError("Terjadi kesalahan, coba lagi");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
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
                        />

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
                            />
                        </div>

                        {/* Field baru: Country */}
                        <FormField
                            label="Country"
                            id="country"
                            name="country"
                            type="text"
                            value={country}
                            placeholder="Your country"
                            onChange={setCountry}
                            error={countryError}
                            onClearError={() => setCountryError("")}
                        />

                        {/* Field baru: City */}
                        <FormField
                            label="City"
                            id="city"
                            name="city"
                            type="text"
                            value={city}
                            placeholder="Your city"
                            onChange={setCity}
                            error={cityError}
                            onClearError={() => setCityError("")}
                        />

                        <FormField
                            label="Address"
                            id="address"
                            name="address"
                            type="textarea"
                            value={address}
                            placeholder="Your address"
                            onChange={setAddress}
                            error={addressError}
                            onClearError={() => setAddressError("")}
                        />

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
                        />

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
                        />

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
                        
                        {submitError && (
                            <p className="text-red-500 text-sm text-center">{submitError}</p>
                        )}

                        <div className="w-full max-w-xl flex flex-col justify-center mt-8">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="font-bold text-white bg-blue-900 w-full py-2 border border-blue-900 rounded-2xl hover:bg-blue-800 hover:shadow cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {isLoading ? "Loading..." : "Save"}
                            </button>
                        </div>
                    </div>
                </form>
            </AuthLayout>
            <VerifyEmailModal
            email={registeredEmail}
            isOpen={showVerifyModal}
            onClose={() => {
                setShowVerifyModal(false);
                router.push("/about");
            }}/>
        </div>
    );
}