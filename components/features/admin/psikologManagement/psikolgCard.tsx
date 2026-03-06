'use client'
import type { PsychologistData } from "@/components/features/admin/psikologManagement/psikologForm";
import { Trash2, User } from "lucide-react";
import { useRouter } from "next/navigation";

type Psikolog = PsychologistData & {
    id: string;
};

type PsikologCardProps = {
    psikolog: Psikolog;
    onDelete: (id: string) => void;
    onEdit: (psikolog: Psikolog) => void;
};

export default function PsikologCard({
    psikolog,
    onDelete,
    onEdit,
}: PsikologCardProps) {
    const router = useRouter();
    const MAX_NAME_LENGTH = 50;
    const shouldTruncateName = psikolog.name.length > MAX_NAME_LENGTH;

    const MAX_SIPP_LENGTH = 20;
    const shouldTruncateSIPP = psikolog.licenseNumber.length > MAX_SIPP_LENGTH;

    return (
        <div className="min-h-22 relative border border-gray-300 rounded-xl py-2 px-4 bg-white shadow w-full max-w-sm hover:bg-gray-50 cursor-pointer">
            <div className="flex gap-2 pr-14">
                <div className="shrink-0">
                    {psikolog.photo ? (
                        <img
                            src={psikolog.photo}
                            alt="Psikolog"
                            className="rounded-full w-18 h-18 object-cover"
                        />
                    ) : (
                        <div className="rounded-full w-18 bg-gray-100 flex items-center justify-center">
                            <User className="text-gray-400" size={32} />
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-1 flex-1 min-w-0 pt-4">
                    <p className={`text-secondary-heading text-sm font-medium truncate ${shouldTruncateName ? 'truncate' : ''}`}>
                        {psikolog.name}
                    </p>
                    <p className={`text-gray-500 text-xs truncate${shouldTruncateSIPP ? 'truncate' : ''}`}>
                        SIPP: <span className="font-medium">{psikolog.licenseNumber}</span>
                    </p>
                </div>
            </div>

            <div className="absolute bottom-2 right-3 flex gap-2 items-center">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onEdit(psikolog);
                    }}
                    className="text-secondary-heading text-sm font-semibold hover:text-primary cursor-pointer">
                    Edit
                </button>
                <Trash2 size={18} className="cursor-pointer hover:text-red-600 text-secondary-heading"
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(psikolog.id);
                    }}
                />
            </div>

        </div>
    );
}
