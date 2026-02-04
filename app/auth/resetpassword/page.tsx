'use client'
import React, {useState} from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import AuthLayout from "@/components/features/user/authLayout";
import FormField from "@/components/common/formField";
import ResetPassModal from "@/components/features/user/resetPassModal";

export default function ResetPassword(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showModal, setShowModal] = useState(false)
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setTimeout(() => {
            if (email){
                setShowModal(true);
            } else{
                setError("Email harus diisi!")
                return;
            }
        }, 1000);
    }

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
                    onChange={setEmail}
                    icon={<Mail className="h-5 w-5"></Mail>}
                    />
                    <div className="w-full max-w-xl flex flex-col justify-center mt-8">
                        <button type="submit" className="font-bold text-white bg-blue-900 w-full py-2 border border-blue-950 rounded-2xl hover:bg-blue-800 hover:shadow cursor-pointer">Send</button>
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