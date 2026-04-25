'use client'
import PsikologCard from "@/components/features/admin/psikologManagement/psikolgCard";
import type { PsychologistData } from "@/components/features/admin/psikologManagement/psikologForm";
import PsychologistForm from "@/components/features/admin/psikologManagement/psikologForm";
import { AlertCircle, AlertTriangle, Check, ChevronLeft, ChevronRight, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { getAllPsychologists, createPsychologist, updatePsychologist, deletePsychologist, getPsychologistById  } from "@/lib/api/admin";

type Psikolog = PsychologistData & {
    id: string;
};

export default function ManagePsikolog() {
    const [psikologs, setPsikologs] = useState<Psikolog[]>([]);
    const [editingPsikolog, setEditingPsikolog] = useState<Psikolog | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error'>('success');
    const [isDirty, setIsDirty] = useState(false);
    const [showUnsavedModal, setShowUnsavedModal] = useState(false);
    const [pendingAction, setPendingAction] = useState<null | (() => void)>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [psikologToDelete, setPsikologToDelete] = useState<Psikolog | null>(null);
    const [tempPassword, setTempPassword] = useState<string | null>(null);
    const [showTempPasswordModal, setShowTempPasswordModal] = useState(false);
    const [copied, setCopied] = useState(false);
    const [isEmailChange, setIsEmailChange] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await getAllPsychologists();
                setPsikologs(result.data);
            } catch (error: any) {
                setToastMessage(error.message || "Gagal memuat data");
                setToastType("error");
                setShowToast(true);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (showToast) {
            const timer = setTimeout(() => setShowToast(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [showToast]);

    const handleDelete = (psikolog: Psikolog) => {
        setPsikologToDelete(psikolog);
        setShowDeleteModal(true);
    };

    const handleSubmitPsikolog = async (data: PsychologistData, photoFile?: File) => {
    
        const payload = {
            email: data.email,
            fullName: data.name,
            sipp: data.licenseNumber,
            str: data.str,
            about: data.bio,
            educations: data.educations.map(edu => ({
                degree: edu.degree,
                institution: edu.university,
                city: edu.city,
                startYear: parseInt(edu.startYear),
                endYear: parseInt(edu.endYear),
            })),
            specializations: data.specializations.map(s => s.title),
            expertises: data.expertise.map(e => e.title),
            experiences: data.experiences.map(e => e.title),
            schedules: data.schedules.map(s => ({
                date: s.date,
                startTime: s.startTime,
                duration: s.duration,
                isAvailable: true,
            })),
        };

        try {
            if (editingPsikolog) {
                const response = await updatePsychologist(editingPsikolog.id, payload, photoFile);
                
                // Jika email berubah, backend kirim tempPassword baru
                if (response.emailChanged && response.tempPassword) {
                    setIsEmailChange(true);
                    setTempPassword(response.tempPassword);
                    setShowTempPasswordModal(true);
                    // Ganti pesan modal agar kontekstual
                    setToastMessage("Data psikolog berhasil diperbarui");
                } else {
                    setToastMessage("Data psikolog berhasil diperbarui");
                    setToastType("success");
                    setShowToast(true);
                }
            } else {
                const response = await createPsychologist(payload, photoFile);
                if (response.user?.tempPassword) {
                    setIsEmailChange(false);
                    setTempPassword(response.user.tempPassword);
                    setShowTempPasswordModal(true);
                }
                setToastMessage("Psikolog baru berhasil ditambahkan");
            }
            setToastType("success");
            const result = await getAllPsychologists();
            setPsikologs(result.data);
            setShowForm(false);
            setEditingPsikolog(null);
        } catch (error: any) {
            setToastMessage(error.message || "Terjadi kesalahan");
            setToastType("error");
            setShowToast(true);
        }
    };

    const handleConfirmDelete = async () => {
        if (!psikologToDelete) return;
        try {
            await deletePsychologist(psikologToDelete.id);
            const result = await getAllPsychologists();
            setPsikologs(result.data);
            setToastMessage("Psikolog berhasil dihapus");
            setToastType("success");
            setShowToast(true);
        } catch (error: any) {
            console.log("Error detail:", error); 
            setToastMessage(error.message || "Gagal menghapus psikolog");
            setToastType("error");
            setShowToast(true);
        } finally {
            setShowDeleteModal(false);
            setPsikologToDelete(null);
        }
    };

    const guardUnsaved = (action: () => void) => {
        if (isDirty) {
            setPendingAction(() => action);
            setShowUnsavedModal(true);
        } else {
            action();
        }
    };

    const handleToggleForm = () => {
        guardUnsaved(() => {
            setEditingPsikolog(null);
            setShowForm(true);
        });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-gray-500">Memuat data...</p>
            </div>
        );
    }

    return (
        <main className="flex-1 overflow-y-auto w-full h-full">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {showToast && (
                    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 pointer-events-none">
                        <div className="bg-white border border-gray-200 rounded-xl shadow-2xl p-2 flex items-center gap-3 max-w-md animate-slide-down pointer-events-auto">
                            <div className={`p-2 rounded-full ${toastType === 'success' ? 'bg-green-100' : 'bg-red-100'}`}>
                                {toastType === 'success' ? (
                                    <Check size={24} className="text-green-600" />
                                ) : (
                                    <AlertCircle size={24} className="text-red-600" />
                                )}
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold text-gray-900">
                                    {toastType === 'success' ? 'Berhasil!' : 'Gagal!'}
                                </p>
                                <p className="text-sm text-gray-600">{toastMessage}</p>
                            </div>
                            <button
                                onClick={() => setShowToast(false)}
                                className="p-1 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                            >
                                <X size={20} className="text-gray-400" />
                            </button>
                        </div>
                    </div>
                )}

                <div className="py-6">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-6">
                        <h1 className="text-2xl md:text-[28px] font-bold text-secondary-heading">
                            Daftar Psikolog
                        </h1>
                        <p className="text-sm text-body-text mt-1">
                            Total: {psikologs.length} psikolog
                        </p>

                        {psikologs.length > 0 && (
                            <button
                                onClick={handleToggleForm}
                                className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 bg-primary p-3 sm:p-4 rounded-full shadow-lg hover:bg-primary/90 transition-all duration-200 z-50 cursor-pointer"
                                aria-label="Tambah psikolog baru"
                            >
                                <Plus size={24} className="text-white" />
                            </button>
                        )}
                    </div>

                    {psikologs.length === 0 && !showForm && (
                        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
                            <p className="text-gray-500 mb-4">Belum ada psikolog terdaftar</p>
                            <button
                                onClick={() => setShowForm(true)}
                                className="bg-primary px-6 py-3 rounded-full flex items-center gap-2 hover:bg-primary/90 transition-colors mx-auto cursor-pointer"
                            >
                                <Plus size={20} className="text-white" />
                                <p className="text-white text-sm">Tambah Psikolog Pertama</p>
                            </button>
                        </div>
                    )}

                    {psikologs.length > 0 && (
                        showForm ? (
                            <div className="relative">
                                <div
                                    className="flex gap-4 overflow-x-auto pb-2 scroll-smooth px-12 hide-scrollbar"
                                    id="psikolog-scroll"
                                >
                                    {psikologs.map(psikolog => (
                                        <div key={psikolog.id} className="min-w-65 sm:min-w-75 md:min-w-[320px]">
                                            <PsikologCard
                                                psikolog={psikolog}
                                                onDelete={() => handleDelete(psikolog)}
                                                onEdit={async (p) => {
                                                    guardUnsaved(async () => {
                                                        try {
                                                            const full = await getPsychologistById(p.id);
                                                            const data = full.data;
                                                            const mapped = {
                                                                ...p,
                                                                name: data.name,
                                                                email: data.user?.email || '',
                                                                licenseNumber: data.sipp,
                                                                str: data.str,
                                                                bio: data.about,
                                                                photo: data.avatarUrl ?? null,
                                                                specializations: data.specializations?.map((s: any) => ({ id: s.id, title: s.name })) || [],
                                                                expertise: data.expertises?.map((e: any) => ({ id: e.id, title: e.name })) || [],
                                                                experiences: data.experiences?.map((e: any) => ({ id: e.id, title: e.name })) || [],
                                                                educations: data.educations?.map((e: any) => ({
                                                                    id: e.id,
                                                                    university: e.institution,
                                                                    degree: e.degree,
                                                                    startYear: String(e.startYear),
                                                                    endYear: String(e.endYear),
                                                                    city: e.city,
                                                                })) || [],
                                                                schedules: data.schedules?.map((s: any) => ({
                                                                    id: s.id,
                                                                    date: s.date?.split('T')[0],
                                                                    startTime: s.startTime,
                                                                    duration: s.duration,
                                                                })) || [],
                                                            };
                                                            setEditingPsikolog(mapped as any);
                                                            setShowForm(true);
                                                        } catch (error: any) {
                                                            setToastMessage("Gagal memuat data psikolog");
                                                            setToastType("error");
                                                            setShowToast(true);
                                                        }
                                                    });
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>
                                <button
                                    onClick={() => document.getElementById('psikolog-scroll')?.scrollBy({ left: 300, behavior: 'smooth' })}
                                    className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow p-2 rounded-full cursor-pointer hover:bg-gray-200"
                                >
                                    <ChevronRight size={22} />
                                </button>
                                <button
                                    onClick={() => document.getElementById('psikolog-scroll')?.scrollBy({ left: -300, behavior: 'smooth' })}
                                    className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow p-2 rounded-full cursor-pointer hover:bg-gray-200"
                                >
                                    <ChevronLeft size={22} />
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {psikologs.map(psikolog => (
                                    <PsikologCard
                                        key={psikolog.id}
                                        psikolog={psikolog}
                                        onDelete={() => handleDelete(psikolog)}
                                        onEdit={async (p) => {
                                            guardUnsaved(async () => {
                                                try {
                                                    const full = await getPsychologistById(p.id);
                                                    const data = full.data;
                                                    const mapped = {
                                                        ...p,
                                                        name: data.name,
                                                        email: data.user?.email || '',
                                                        licenseNumber: data.sipp,
                                                        str: data.str,
                                                        bio: data.about,
                                                        photo: data.avatarUrl ?? null,
                                                        specializations: data.specializations?.map((s: any) => ({
                                                            id: s.id,
                                                            title: s.name,
                                                        })) || [],
                                                        expertise: data.expertises?.map((e: any) => ({
                                                            id: e.id,
                                                            title: e.name,
                                                        })) || [],
                                                        experiences: data.experiences?.map((e: any) => ({
                                                            id: e.id,
                                                            title: e.name,
                                                        })) || [],
                                                        educations: data.educations?.map((e: any) => ({
                                                            id: e.id,
                                                            university: e.institution,
                                                            degree: e.degree,
                                                            startYear: String(e.startYear),
                                                            endYear: String(e.endYear),
                                                            city: e.city,
                                                        })) || [],
                                                        schedules: data.schedules?.map((s: any) => ({
                                                            id: s.id,
                                                            date: s.date?.split('T')[0],
                                                            startTime: s.startTime,
                                                            duration: s.duration,
                                                        })) || [],
                                                    };
                                                    setEditingPsikolog(mapped as any);
                                                    setShowForm(true);
                                                } catch (error: any) {
                                                    setToastMessage("Gagal memuat data psikolog");
                                                    setToastType("error");
                                                    setShowToast(true);
                                                }
                                            });
                                        }}
                                    />
                                ))}
                            </div>
                        )
                    )}
                </div>

                {showForm && (
                    <div className="md:mt-6 md:p-6 pt-0">
                        <div className="border-t border-gray-300 mb-6" />
                        <div className="bg-white rounded-xl shadow-sm relative">
                            <div className="flex justify-between items-center mb-4 pr-4">
                                <div className="p-6">
                                    <h2 className="text-xl font-semibold text-blue-950">
                                        {editingPsikolog ? "Edit Psikolog" : "Tambah Psikolog Baru"}
                                    </h2>
                                </div>
                                <button
                                    onClick={() => guardUnsaved(() => { setShowForm(false); setEditingPsikolog(null); })}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                                    aria-label="Tutup form"
                                >
                                    <X size={20} className="text-gray-600" />
                                </button>
                            </div>
                            <PsychologistForm
                                key={editingPsikolog?.id ?? "new"}
                                initialData={editingPsikolog ?? undefined}
                                onSubmit={handleSubmitPsikolog}
                                onDirtyChange={setIsDirty}
                            />
                        </div>
                    </div>
                )}

                {showUnsavedModal && (
                    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-6 md:px-4">
                        <div className="bg-white rounded-2xl w-full max-w-md p-4 sm:p-5 shadow-lg max-h-[90vh] overflow-y-auto">
                            <div className="flex flex-col items-center gap-1 sm:gap-2 text-center">
                                <AlertTriangle size={36} className="text-red-500 mt-1" />
                                <h3 className="font-semibold text-lg text-gray-800">Perubahan belum disimpan</h3>
                                <p className="text-sm text-gray-600">Semua perubahan akan hilang jika keluar sekarang.</p>
                            </div>
                            <div className="flex justify-center gap-8 mt-6">
                                <button
                                    onClick={() => { setShowUnsavedModal(false); setPendingAction(null); }}
                                    className="px-4 py-2 rounded-full bg-[#EAEAEA] text-black hover:bg-[#cdcdcd] transition-colors text-sm font-medium cursor-pointer"
                                >
                                    <span className="sm:hidden">Lanjut</span>
                                    <span className="hidden sm:inline">Lanjut mengedit</span>
                                </button>
                                <button
                                    onClick={() => { setShowUnsavedModal(false); setIsDirty(false); pendingAction?.(); setPendingAction(null); }}
                                    className="px-4 py-2 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors text-sm font-medium cursor-pointer"
                                >
                                    <span className="sm:hidden">Keluar</span>
                                    <span className="hidden sm:inline">Keluar tanpa menyimpan</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {showDeleteModal && psikologToDelete && (
                    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-6 md:px-4">
                        <div className="bg-white rounded-2xl w-full max-w-md p-4 sm:p-6 shadow-lg">
                            <div className="flex flex-col items-center gap-1 sm:gap-2">
                                <AlertTriangle size={38} className="text-red-500 mt-1" />
                                <div className="text-center">
                                    <h3 className="font-semibold text-lg text-gray-800">Hapus Psikolog?</h3>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Data <span className="font-medium">{psikologToDelete.name}</span> akan dihapus secara permanen.
                                    </p>
                                </div>
                            </div>
                            <div className="flex justify-center gap-8 mt-6">
                                <button
                                    onClick={() => { setShowDeleteModal(false); setPsikologToDelete(null); }}
                                    className="px-4 py-2 rounded-full bg-[#EAEAEA] text-black hover:bg-[#cdcdcd] cursor-pointer"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={handleConfirmDelete}
                                    className="px-4 py-2 rounded-full bg-red-600 text-white hover:bg-red-700 cursor-pointer"
                                >
                                    Hapus
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {showTempPasswordModal && tempPassword && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-lg">
                        <div className="flex flex-col items-center gap-3 text-center">
                            <div className="p-3 bg-green-100 rounded-full">
                                <Check size={32} className="text-green-600" />
                            </div>
                            <h3 className="font-bold text-lg text-gray-800">
                                {isEmailChange
                                    ? "Email Psikolog Diubah!"
                                    : "Psikolog Berhasil Ditambahkan!"}
                            </h3>
                            <p className="text-sm text-gray-600">
                                {isEmailChange
                                    ? "Email berhasil diubah. Password lama tidak berlaku lagi. Berikan password sementara ini kepada psikolog untuk login dengan email baru."
                                    : "Simpan password sementara ini. Psikolog harus login menggunakan password ini dan akan diminta menggantinya."}
                            </p>
                            <div className="w-full bg-gray-100 rounded-xl p-4 mt-2">
                                <p className="text-xs text-gray-500 mb-1">Password Sementara</p>
                                <div className="flex items-center justify-between gap-2">
                                    <code className="text-lg font-bold text-gray-800 tracking-widest">
                                        {tempPassword}
                                    </code>
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(tempPassword);
                                            setCopied(true);
                                            setTimeout(() => setCopied(false), 2000);
                                        }}
                                        className="px-3 py-1 text-gray-700 rounded-lg text-xs font-medium hover:text-gray-900 cursor-pointer"
                                    >
                                        {copied ? "Tersalin!" : "Salin"}
                                    </button>
                                </div>
                            </div>
                            <p className="text-xs text-red-500 mt-1">
                                Password ini hanya ditampilkan sekali. Pastikan sudah disalin!
                            </p>
                        </div>
                        <button
                            onClick={() => {
                                setShowTempPasswordModal(false);
                                setTempPassword(null);
                                setCopied(false);
                                setIsEmailChange(false);
                                setToastType("success");
                                setShowToast(true);
                            }}
                            className="mt-6 w-full py-2 bg-[#1f3b5b] text-white rounded-full font-medium hover:bg-[#2B5379] cursor-pointer"
                        >
                            Selesai menyalin password
                        </button>
                    </div>
                </div>
            )}
        </main>
    );
}