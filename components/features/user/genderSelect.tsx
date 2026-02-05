'use client'
import React from "react";

type GenderSelectProps = {
    value: "male" | "female";
    onChange: (value: "male" | "female") => void;
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
                    onClick={() => onChange("male")}
                    className={`px-6 py-2 rounded-full border font-medium cursor-pointer ${
                        value === "male"
                            ? "bg-blue-900 text-white hover:bg-blue-800 cursor-pointer"
                            : "border-blue-950 text-blue-950"
                    }`}
                >
                    Male
                </button>

                <button
                    type="button"
                    onClick={() => onChange("female")}
                    className={`px-6 py-2 rounded-full border font-medium cursor-pointer ${
                        value === "female"
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
