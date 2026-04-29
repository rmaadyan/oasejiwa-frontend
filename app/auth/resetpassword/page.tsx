'use client'
import React, {useState} from "react";
import { Mail } from "lucide-react";
import AuthLayout from "@/components/features/user/authLayout";
import FormField from "@/components/common/formField";
import ResetPassModal from "@/components/features/user/resetPassModal";
import { validateEmail } from "@/lib/email";

export default function ResetPassword(){
    const [email, setEmail] = useState("");
    const [showModal, setShowModal] = useState(false)
    const [error, setError] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const emailError = validateEmail(email);

        if (emailError) {
            setError(emailError); 
            return;
        }

        setTimeout(() => {
            setShowModal(true);
        }, 1000);
    };

    return(
        <div>
            <AuthLayout
            title="Reset Password"
            description="Masukkan email untuk mengatur ulang password"
            >
                <form onSubmit={handleSubmit}>
                    <FormField
                    label="Email"
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    placeholder="your@gmail.com"
                    onChange={(val) => {
                        setEmail(val);
                        setError("");
                    }}
                    icon={<Mail className="h-5 w-5" />}
                    error={error} 
                    />
                    <div className="w-full max-w-xl flex flex-col justify-center mt-8">
                        <button type="submit" className="font-bold text-white bg-[#234463] w-full py-2 border border-[#234463] rounded-2xl hover:bg-[#2B5379] hover:shadow cursor-pointer">Send</button>
                    </div>
                </form>
            </AuthLayout>
            <ResetPassModal
            open = {showModal}
                title = "Berhasil terkirim"
                message = {`Silahkan cek email anda ${email} untuk merubah password`}
                onClose = {() => setShowModal(false)}
            >
            </ResetPassModal>
        </div>
    );
}