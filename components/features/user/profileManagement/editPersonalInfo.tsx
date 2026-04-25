'use client'

import { useState } from "react";
import { X } from "lucide-react";
import FormField from "@/components/common/formField";
import GenderSelect from "../genderSelect";
import CustomCalendar from "@/components/common/calendar";

type EditProfileProps = {
    initialData: {
        fullName: string;
        gender: "MALE" | "FEMALE" | null;
        birthday: string;
        email: string;
        phone: string;
    };
    onClose: () => void;
    onSave: (data: EditProfileProps["initialData"]) => void;
};

export default function EditPersonalInformation({
    initialData,
    onSave,
    onClose,
}: EditProfileProps) {
    const [name, setName] = useState(initialData.fullName);
    const [telephone, setTelephone] = useState(initialData.phone);
    const [email, setEmail] = useState(initialData.email);
    const [date, setDate] = useState(initialData.birthday); 
    const [gender, setGender] = useState<"MALE" | "FEMALE">(
        initialData.gender ?? "MALE" 
    );
    const [error, setError] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !telephone || !email || !date) {
            setError("Lengkapi semua data!");
            return;
        }
        onSave({
            fullName: name,
            gender: gender,
            birthday: date,
            email: email,
            phone: telephone,
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-6">
        
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl p-6 relative">
            
            <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 cursor-pointer">
            <X size={20} />
            </button>

            <h1 className="text-2xl font-bold text-blue-950 mb-6">
            Edit Profile
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
            <FormField
                label="Full Name"
                id="name"
                name="name"
                type="text"
                value={name}
                onChange={setName}
            />

            <div className="flex flex-col gap-6">
                <div>
                    <label className="block text-sm font-bold text-blue-950 mb-2">
                        Birthday
                    </label>
                    <CustomCalendar
                    value={date}
                    onChange={(newDate) => setDate(newDate)}
                    placeholder="Pilih tanggal lahir"
                    className="text-gray-700"
                    />
                </div>
                <GenderSelect value={gender} onChange={setGender} />
            </div>

            <FormField
                label="WhatsApp"
                id="whatsapp"
                name="number"
                type="tel"
                value={telephone}
                onChange={setTelephone}
            />

            <FormField
                label="Email"
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={setEmail}
            />

            {error && (
                <p className="text-sm text-red-600 bg-red-50 p-2 rounded">
                {error}
                </p>
            )}

            <div className="flex justify-end gap-3">
                <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-100 cursor-pointer">
                    Cancel
                </button>
                <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-blue-900 hover:bg-blue-800 text-white font-semibold cursor-pointer">
                    Save
                </button>
            </div>
            </form>
        </div>
        </div>
    );
}
