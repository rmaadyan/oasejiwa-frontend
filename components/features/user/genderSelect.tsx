'use client'

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
            <label className="block text-sm font-semibold text-[#234463] mb-2">
                Gender
            </label>

            <div className="flex gap-3">
                <button
                    type="button"
                    onClick={() => onChange("MALE")}
                    className={`px-6 py-2 rounded-full border font-medium cursor-pointer ${
                        value === "MALE"
                            ? "bg-[#234463] text-white hover:bg-[#2B5379] cursor-pointer"
                            : "border-[#2B5379] text-[#234463]"
                    }`}
                >
                    Male
                </button>

                <button
                    type="button"
                    onClick={() => onChange("FEMALE")}
                    className={`px-6 py-2 rounded-full border font-medium cursor-pointer ${
                        value === "FEMALE"
                            ? "bg-blue-900 text-white hover:bg-[#2B5379] cursor-pointer"
                            : "border-[#2B5379] text-[#234463]"
                    }`}
                >
                    Female
                </button>
            </div>
        </div>
    );
}
