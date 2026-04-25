'use client'
import React from "react";

type GenderSelectProps = {
    value: "MALE" | "FEMALE";
    onChange: (value: "MALE" | "FEMALE") => void;
};

export default function GenderSelect({
    value,
    onChange,
}: GenderSelectProps) {
    return (
        <div className="w-full">
            <label className="block text-sm font-semibold text-blue-950 mb-2">
                Gender
            </label>

            <div className="flex gap-3">
                <button
                    type="button"
                    onClick={() => onChange("MALE")}
                    className={`px-6 py-2 rounded-full border font-medium cursor-pointer ${
                        value === "MALE"
                            ? "bg-blue-900 text-white hover:bg-blue-800 cursor-pointer"
                            : "border-blue-950 text-blue-950"
                    }`}
                >
                    Male
                </button>

                <button
                    type="button"
                    onClick={() => onChange("FEMALE")}
                    className={`px-6 py-2 rounded-full border font-medium cursor-pointer ${
                        value === "FEMALE"
                            ? "bg-blue-900 text-white hover:bg-blue-800 cursor-pointer"
                            : "border-blue-950 text-blue-950"
                    }`}
                >
                    Female
                </button>
            </div>
        </div>
    );
}
