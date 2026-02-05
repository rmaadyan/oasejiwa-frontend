'use client'

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import FormField from "@/components/common/formField";

type EditAddressProps = {
    initialData: {
        address: string;
        country: string;
        city: string;
    };
    onClose: () => void;
    onSave: (data: EditAddressProps["initialData"]) => void
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

    useEffect(() => {
        fetch("https://restcountries.com/v3.1/all")
            .then(res => {
                if (!res.ok) throw new Error("Country API failed");
                return res.json();
            })
            .then(data => {
                if (!Array.isArray(data)) return;
                setCountries(
                    data
                        .map((c: any) => c?.name?.common)
                        .filter(Boolean)
                        .sort()
                );
            })
            .catch(() => setCountries([]));
    }, []);

    useEffect(() => {
        if (!country) return;

        fetch(`https://restcountries.com/v3.1/name/${country}`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data) && data[0]?.cca2) {
                    setCountryCode(data[0].cca2);
                }
            })
            .catch(() => setCountryCode(""));
    }, [country]);

    useEffect(() => {
        if (!countryCode) return;

        fetch(
            `https://geodb-free-service.wirefreethought.com/v1/geo/countries/${countryCode}/cities?limit=10`
        )
            .then(res => res.json())
            .then(data => {
                if (!Array.isArray(data?.data)) {
                    setCities([]);
                    return;
                }
                setCities(data.data.map((c: any) => c.name));
            })
            .catch(() => setCities([]));
    }, [countryCode]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!country || !city || !address) {
            setError("Lengkapi semua data!");
            return;
        }
        onSave({country, city, address});
        onClose();
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

            <h1 className="text-2xl font-bold text-blue-950 mb-6">
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
                    className="px-4 py-2 rounded-lg bg-blue-900 hover:bg-blue-800 text-white font-semibold cursor-pointer"
                    >
                        Save
                    </button>
                </div>
            </form>
        </div>
        </div>
    );
}
