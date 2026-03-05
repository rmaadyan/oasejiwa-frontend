'use client'
import PsikologCard from "@/components/features/admin/psikologManagement/psikolgCard";
import type { PsychologistData } from "@/components/features/admin/psikologManagement/psikologForm";
import PsychologistForm from "@/components/features/admin/psikologManagement/psikologForm";
import { AlertCircle, AlertTriangle, Check, ChevronLeft, ChevronRight, Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
type Psikolog = PsychologistData & {
    id: string;
};

export default function ManagePsikolog() {
    const router = useRouter();
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
    useEffect(() => {
        try {
            const data = JSON.parse(localStorage.getItem("psikologs") || "[]");
            setPsikologs(data);
        } catch (error) {
            console.error("Error loading data:", error);
            setToastMessage("Gagal memuat data");
            setToastType("error");
            setShowToast(true);
            setPsikologs([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (showToast) {
            const timer = setTimeout(() => {
                setShowToast(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [showToast]);

    const handleDelete = (psikolog: Psikolog) => {
        setPsikologToDelete(psikolog);
        setShowDeleteModal(true);
    };

    const handleSubmitPsikolog = (data: any) => {
        if (editingPsikolog) {
            const updated = psikologs.map(p =>
                p.id === editingPsikolog.id
                    ? { ...p, ...data }
                    : p
            );

            setPsikologs(updated);
            localStorage.setItem("psikologs", JSON.stringify(updated));
            setToastMessage('Data psikolog berhasil diperbarui');
            setToastType('success');
            setShowToast(true);
        } else {
            const newPsikolog = {
                id: Date.now().toString(),
                ...data,
            };

            const updated = [...psikologs, newPsikolog];
            setPsikologs(updated);
            localStorage.setItem("psikologs", JSON.stringify(updated));
            setToastMessage('Psikolog baru berhasil ditambahkan');
            setToastType('success');
            setShowToast(true);
        }

        setShowForm(false);
        setEditingPsikolog(null);
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

    const guardUnsaved = (action: () => void) => {
        if (isDirty) {
            setPendingAction(() => action);
            setShowUnsavedModal(true);
        } else {
            action();
        }
    };

    return (
        <main className="flex-1 overflow-y-auto w-full h-full">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {showToast && (
                    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 pointer-events-none">
                        <div className="bg-white border border-gray-200 rounded-xl shadow-2xl p-2 flex items-center gap-3 max-w-md animate-slide-down pointer-events-auto">
                            <div className={`p-2 rounded-full ${toastType === 'success'
                                ? 'bg-green-100'
                                : 'bg-red-100'
                                }`}>
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
                        <h1 className="text-blue-950 font-bold text-2xl sm:text-3xl lg:text-4xl">
                            Daftar Psikolog
                        </h1>
                        <p className="text-gray-600 text-sm sm:text-base">
                            Total: {psikologs.length} psikolog
                        </p>

                        {psikologs.length > 0 && (
                            <button
                                onClick={handleToggleForm}
                                className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 bg-[#1f3b5b] p-3 sm:p-4 rounded-full shadow-lg hover:bg-blue-900 transition-all duration-200 z-50 cursor-pointer"
                                aria-label="Tambah psikolog baru"
                            >
                                <Plus size={24} className="text-white" />
                            </button>
                        )}
                    </div>

                    {psikologs.length === 0 && !showForm && (
                        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
                            <p className="text-gray-500 mb-4">
                                Belum ada psikolog terdaftar
                            </p>
                            <button
                                onClick={() => setShowForm(true)}
                                className="bg-[#1f3b5b] px-6 py-3 rounded-full flex items-center gap-2 hover:bg-blue-900 transition-colors mx-auto cursor-pointer"
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
                                                onEdit={(p) => {
                                                    guardUnsaved(() => {
                                                        setEditingPsikolog(p);
                                                        setShowForm(true);
                                                    });
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>

                                <button
                                    onClick={() => {
                                        document.getElementById('psikolog-scroll')?.scrollBy({
                                            left: 300,
                                            behavior: 'smooth'
                                        });
                                    }}
                                    className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow p-2 rounded-full cursor-pointer hover:bg-gray-200"
                                >
                                    <ChevronRight size={22} />
                                </button>

                                <button
                                    onClick={() => {
                                        document.getElementById('psikolog-scroll')?.scrollBy({
                                            left: -300,
                                            behavior: 'smooth'
                                        });
                                    }}
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
                                        onEdit={(p) => {
                                            guardUnsaved(() => {
                                                setEditingPsikolog(p);
                                                setShowForm(true);
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
                        <div className="bg-white rounded-xl shadow-sm relative ">
                            <div className="flex justify-between items-center mb-4 pr-4">
                                <div className="p-6">
                                    <h2 className="text-xl font-semibold text-blue-950">
                                        {editingPsikolog ? "Edit Psikolog" : "Tambah Psikolog Baru"}
                                    </h2>
                                </div>
                                <button
                                    onClick={() => {
                                        guardUnsaved(() => {
                                            setShowForm(false)
                                            setEditingPsikolog(null);
                                        })
                                    }}
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
                                <h3 className="font-semibold text-lg text-gray-800">
                                    Perubahan belum disimpan
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Semua perubahan akan hilang jika keluar sekarang.
                                </p>
                            </div>

                            <div className="flex justify-center gap-8 mt-6">
                                <button
                                    onClick={() => {
                                        setShowUnsavedModal(false);
                                        setPendingAction(null);
                                    }}
                                    className="px-4 py-2 rounded-full bg-[#EAEAEA] text-black hover:bg-[#cdcdcd] transition-colors
                                            text-sm font-medium cursor-pointer">
                                    <span className="sm:hidden">Lanjut</span>
                                    <span className="hidden sm:inline">Lanjut mengedit</span>
                                </button>

                                <button
                                    onClick={() => {
                                        setShowUnsavedModal(false);
                                        setIsDirty(false);
                                        pendingAction?.();
                                        setPendingAction(null);
                                    }}
                                    className="px-4 py-2 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors
                                            text-sm font-medium cursor-pointer">
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
                                    <h3 className="font-semibold text-lg text-gray-800">
                                        Hapus Psikolog?
                                    </h3>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Data <span className="font-medium">{psikologToDelete.name}</span> akan
                                        dihapus secara permanen.
                                    </p>
                                </div>
                            </div>

                            <div className="flex justify-center gap-8 mt-6">
                                <button
                                    onClick={() => {
                                        setShowDeleteModal(false);
                                        setPsikologToDelete(null);
                                    }}
                                    className="px-4 py-2 rounded-full bg-[#EAEAEA] text-black hover:bg-[#cdcdcd] cursor-pointer"
                                >
                                    Batal
                                </button>

                                <button
                                    onClick={() => {
                                        const filtered = psikologs.filter(
                                            p => p.id !== psikologToDelete.id
                                        );
                                        setPsikologs(filtered);
                                        localStorage.setItem("psikologs", JSON.stringify(filtered));

                                        setShowDeleteModal(false);
                                        setPsikologToDelete(null);

                                        setToastMessage("Psikolog berhasil dihapus");
                                        setToastType("success");
                                        setShowToast(true);
                                    }}
                                    className="px-4 py-2 rounded-full bg-red-600 text-white hover:bg-red-700 cursor-pointer"
                                >
                                    Hapus
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}