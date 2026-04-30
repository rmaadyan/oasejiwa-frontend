'use client'

import { useState } from "react";
import { X } from "lucide-react";
import FormField from "@/components/common/formField";

type EditAddressProps = {
    initialData: {
        address: string;
        country: string;
        city: string;
    };
    onClose: () => void;
    onSave: (data: EditAddressProps["initialData"]) => Promise<void>;
};

export default function EditAddress({
    initialData,
    onSave,
    onClose,
}: EditAddressProps) {
    const [address, setAddress] = useState(initialData.address);
    const [country, setCountry] = useState(initialData.country);
    const [city, setCity] = useState(initialData.city);
    const [error, setError] = useState("");

    const [countries, setCountries] = useState<string[]>([]);
    const [cities, setCities] = useState<string[]>([]);
    const [countryCode, setCountryCode] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!country || !city || !address) {
            setError("Lengkapi semua data!");
            return;
        }
        try {
            await onSave({ country, city, address });
            onClose(); 
        } catch (err) {
            setError("Gagal menyimpan. Coba lagi.");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-6">
        
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl p-6 relative">
            
            <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 cursor-pointer"
            >
            <X size={20} />
            </button>

            <h1 className="text-2xl font-bold text-[#234463] mb-6">
                Edit Address
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">

                <FormField
                label="Country"
                id="country"
                type="text"
                value={country}
                onChange={(val)=>{
                    setCountry(val);
                    setCity("");
                }}
                options={countries}
                placeholder="Type country"
                ></FormField>

                <FormField
                label="City"
                id="city"
                type="text"
                value={city}
                onChange={setCity}
                options={cities}
                disabled={!country}
                placeholder={country ? "Type city..." : "Select country first"}
                ></FormField>

                <FormField
                label="Address"
                id="address"
                name="address"
                type="textarea"
                value={address}
                onChange={setAddress}
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
                    className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-100 cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-[#234463] hover:bg-[#2B5379] text-white font-semibold cursor-pointer"
                    >
                        Save
                    </button>
                </div>
            </form>
        </div>
        </div>
    );
}
