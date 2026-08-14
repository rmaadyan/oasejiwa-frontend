'use client';

import { useState, useEffect } from "react";
import { Plus, Search, UserCheck, Mail, Lock, X, CheckCircle2, Pencil, Trash2, AlertTriangle, Clock, Eye, ArrowUp, ArrowDown } from "lucide-react";
import Link from "next/link";
import { getAllPsychologistsAdmin, API_BASE_URL } from "@/lib/api/psychologist";

export default function PsikologManagementPage() {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingPsikolog, setEditingPsikolog] = useState<any | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [psikologList, setPsikologList] = useState<any[]>([]);
    const [loadingFetch, setLoadingFetch] = useState(true);
    const [sendingReminderId, setSendingReminderId] = useState<string | null>(null);

    const fetchPsikologs = async () => {
        setLoadingFetch(true);
        try {
            const res = await getAllPsychologistsAdmin();
            const rawData = res.data || [];

            const formatted = rawData.map((item: any) => {
                const sippVal = item.sipp || "";
                const isComplete = sippVal !== "" && sippVal !== "-";

                return {
                    id: item.id,
                    fullName: item.fullName || item.name,
                    email: item.user?.email || item.email || "-",
                    phoneNumber: item.phoneNumber || item.phone || item.user?.phoneNumber || "-",
                    sipp: item.sipp || "-",
                    str: item.str || "-",
                    isProfileComplete: item.user?.isProfileComplete ?? isComplete,
                };
            });

            setPsikologList(formatted);
        } catch (err) {
            console.error("Gagal mengambil data psikolog:", err);
        } finally {
            setLoadingFetch(false);
        }
    };

    useEffect(() => {
        fetchPsikologs();
    }, []);

    // 🟢 Fitur Mengubah Urutan Tata Letak Psikolog (Naik / Turun)
    const handleMoveOrder = (index: number, direction: "up" | "down") => {
        const targetIndex = direction === "up" ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= psikologList.length) return;

        const updatedList = [...psikologList];
        const temp = updatedList[index];
        updatedList[index] = updatedList[targetIndex];
        updatedList[targetIndex] = temp;

        setPsikologList(updatedList);
    };

    const handleSuccessAdd = () => {
        fetchPsikologs();
    };

    const handleSuccessEdit = (updatedData: any) => {
        setPsikologList((prev) =>
            prev.map((item) => (item.id === updatedData.id ? { ...item, ...updatedData } : item))
        );
        fetchPsikologs();
    };

    const handleSendReminder = async (psikologId: string, email: string) => {
        setSendingReminderId(psikologId);
        const token = typeof window !== "undefined" ? localStorage.getItem("token") || "" : "";
        try {
            const res = await fetch(`${API_BASE_URL}/admin/psychologist/${psikologId}/send-reminder`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                credentials: "include",
            });

            const result = await res.json();
            if (!res.ok) throw new Error(result.message || "Gagal mengirim email pengingat");

            alert(`Email pengingat berhasil dikirimkan ke ${email}`);
        } catch (err: any) {
            alert(err.message || "Gagal mengirim email pengingat.");
        } finally {
            setSendingReminderId(null);
        }
    };

    const ConfirmDelete = async () => {
        if (!deletingId) return;
        const token = typeof window !== "undefined" ? localStorage.getItem("token") || "" : "";

        try {
            const res = await fetch(`${API_BASE_URL}/admin/psychologists/${deletingId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                credentials: "include",
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.message || "Gagal menghapus akun psikolog");
            }

            setPsikologList((prev) => prev.filter((item) => item.id !== deletingId));
            alert("Akun psikolog berhasil dihapus.");
        } catch (err: any) {
            alert(err.message || "Gagal menghapus akun psikolog.");
        } finally {
            setDeletingId(null);
        }
    };

    const filteredList = psikologList.filter((p) =>
        p.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sipp?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.phoneNumber?.includes(searchQuery)
    );

    return (
        <div className="w-full p-6 sm:p-8 font-poppins space-y-6">
            {/* HEADER SECTION */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-5">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-[#234463]">Manajemen Psikolog</h1>
                    <p className="text-sm text-slate-500 mt-1">Kelola pendaftaran, pembaruan data, dan akun psikolog resmi Oase Jiwa</p>
                </div>

                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#234463] text-white font-medium text-sm rounded-xl hover:bg-[#2B5379] transition shadow-md cursor-pointer active:scale-95 shrink-0"
                >
                    <Plus size={18} />
                    <span>Tambah Psikolog Baru</span>
                </button>
            </div>

            {/* FILTER & SEARCH BAR */}
            <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs w-full">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Cari psikolog berdasarkan nama, SIPP, atau No. HP..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#234463] transition"
                    />
                </div>
                <div className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-2 rounded-lg shrink-0">
                    Total Psikolog: {filteredList.length}
                </div>
            </div>

            {/* TABEL DAFTAR PSIKOLOG */}
            <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden w-full">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-[#F8FAFC] border-b border-slate-200 text-slate-600 font-semibold">
                            <tr>
                                <th className="p-4 pl-6 w-16 text-center">Urutan</th>
                                <th className="p-4">Psikolog</th>
                                <th className="p-4">No. HP / WA</th>
                                <th className="p-4">No. SIPP / STR</th>
                                <th className="p-4">Status Akun</th>
                                <th className="p-4 pr-6 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700">
                            {loadingFetch ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-8 text-slate-400">Memuat data psikolog...</td>
                                </tr>
                            ) : filteredList.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-8 text-slate-400">Belum ada data psikolog.</td>
                                </tr>
                            ) : (
                                filteredList.map((item, index) => {
                                    const isComplete = item.sipp && item.sipp !== "-" && item.sipp !== "";

                                    return (
                                        <tr key={item.id} className="hover:bg-slate-50/80 transition">
                                            {/* 🟢 Kolom Tombol Urutan Tata Letak */}
                                            <td className="p-4 pl-6 text-center">
                                                <div className="flex items-center justify-center gap-1">
                                                    <button
                                                        disabled={index === 0}
                                                        onClick={() => handleMoveOrder(index, "up")}
                                                        className="p-1 text-slate-400 hover:text-[#234463] hover:bg-slate-100 rounded-md disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer transition"
                                                        title="Pindah ke Atas"
                                                    >
                                                        <ArrowUp size={15} />
                                                    </button>
                                                    <button
                                                        disabled={index === filteredList.length - 1}
                                                        onClick={() => handleMoveOrder(index, "down")}
                                                        className="p-1 text-slate-400 hover:text-[#234463] hover:bg-slate-100 rounded-md disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer transition"
                                                        title="Pindah ke Bawah"
                                                    >
                                                        <ArrowDown size={15} />
                                                    </button>
                                                </div>
                                            </td>

                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-blue-100 text-[#234463] font-bold flex items-center justify-center text-sm shrink-0">
                                                        {item.fullName ? item.fullName.slice(0, 2).toUpperCase() : "PS"}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-slate-900">{item.fullName}</p>
                                                        <p className="text-xs text-slate-500">{item.email}</p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="p-4">
                                                <p className="text-xs font-medium text-slate-700">{item.phoneNumber || "-"}</p>
                                            </td>

                                            <td className="p-4">
                                                <p className="font-mono text-xs bg-slate-100 px-2.5 py-1 rounded-md w-fit">{item.sipp || "-"}</p>
                                            </td>

                                            <td className="p-4">
                                                {isComplete ? (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium border border-emerald-200">
                                                        <CheckCircle2 size={12} />
                                                        Aktif
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-medium border border-amber-200" title="Menunggu psikolog login & melengkapi data profil">
                                                        <Clock size={12} />
                                                        Menunggu Profil
                                                    </span>
                                                )}
                                            </td>

                                            <td className="p-4 pr-6 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {!isComplete && (
                                                        <button
                                                            onClick={() => handleSendReminder(item.id, item.email)}
                                                            disabled={sendingReminderId === item.id}
                                                            className="p-2 text-amber-600 hover:bg-amber-50 rounded-xl transition cursor-pointer flex items-center gap-1 text-xs font-medium border border-amber-200/60"
                                                            title="Kirim Email Pengingat Update Profil"
                                                        >
                                                            <Mail size={15} />
                                                            <span className="hidden sm:inline">
                                                                {sendingReminderId === item.id ? "Sending..." : "Ingatkan"}
                                                            </span>
                                                        </button>
                                                    )}

                                                    <Link
                                                        href={`/psikologdetail?id=${item.id}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-2 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition cursor-pointer"
                                                        title="Lihat Tampilan di Website Publik"
                                                    >
                                                        <Eye size={16} />
                                                    </Link>

                                                    <button
                                                        onClick={() => setEditingPsikolog(item)}
                                                        className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition cursor-pointer"
                                                        title="Edit Data Psikolog"
                                                    >
                                                        <Pencil size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => setDeletingId(item.id)}
                                                        className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition cursor-pointer"
                                                        title="Hapus Akun Psikolog"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL 1: TAMBAH PSIKOLOG */}
            {isAddModalOpen && (
                <AddPsychologistModal
                    onClose={() => setIsAddModalOpen(false)}
                    onSuccess={handleSuccessAdd}
                />
            )}

            {/* MODAL 2: EDIT PSIKOLOG */}
            {editingPsikolog && (
                <EditPsychologistModal
                    initialData={editingPsikolog}
                    onClose={() => setEditingPsikolog(null)}
                    onSuccess={handleSuccessEdit}
                />
            )}

            {/* MODAL 3: KONFIRMASI HAPUS */}
            {deletingId && (
                <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl text-center space-y-4">
                        <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
                            <AlertTriangle size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800 text-base">Hapus Akun Psikolog?</h3>
                            <p className="text-xs text-slate-500 mt-1">Tindakan ini akan menghapus akses login psikolog secara permanen.</p>
                        </div>
                        <div className="flex justify-center gap-3 pt-2">
                            <button
                                onClick={() => setDeletingId(null)}
                                className="px-4 py-2 border rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                            >
                                Batal
                            </button>
                            <button
                                onClick={ConfirmDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-semibold hover:bg-red-700 shadow-sm cursor-pointer"
                            >
                                Ya, Hapus
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function AddPsychologistModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phoneNumber: "",
        sipp: "-",
        str: "-",
        temporaryPassword: "",
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const randomPass = "Oase" + Math.floor(100000 + Math.random() * 900000);
        setFormData((prev) => ({ ...prev, temporaryPassword: randomPass }));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const token = typeof window !== "undefined" ? localStorage.getItem("token") || "" : "";

        try {
            const res = await fetch(`${API_BASE_URL}/admin/psychologists`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                credentials: "include",
                body: JSON.stringify({
                    fullName: formData.fullName,
                    email: formData.email,
                    phoneNumber: formData.phoneNumber,
                    sipp: formData.sipp,
                    str: formData.str || undefined,
                    temporaryPassword: formData.temporaryPassword,
                }),
            });

            const result = await res.json();

            if (!res.ok) {
                const errMsg = Array.isArray(result.message) ? result.message.join(", ") : result.message;
                throw new Error(errMsg || "Gagal membuat akun psikolog");
            }

            alert(`Berhasil!\nAkun Psikolog dibuat & email kredensial dikirimkan ke ${formData.email}`);
            onSuccess();
            onClose();
        } catch (error: any) {
            alert(error.message || "Gagal mendaftarkan psikolog");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 font-poppins">
            <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6">
                <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                    <div>
                        <h3 className="text-xl font-bold text-[#234463] flex items-center gap-2">
                            <UserCheck size={22} /> Tambah Psikolog Baru
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">Kredensial dan instruksi aktivasi 1x24 jam akan dikirim via email.</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full cursor-pointer"><X size={20} /></button>
                </div>

                <div className="bg-blue-50/80 border border-blue-100 rounded-2xl p-3.5 flex items-start gap-3">
                    <Mail className="text-[#234463] shrink-0 mt-0.5" size={18} />
                    <p className="text-xs text-slate-600 leading-relaxed">
                        Email kredensial beserta instruksi wajib melengkapi data profil dalam <b>1x24 Jam</b> akan otomatis dikirimkan ke email psikolog.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-xs font-semibold text-slate-700">Nama Lengkap & Gelar *</label>
                        <input
                            type="text"
                            required
                            placeholder="Dr. Sarah Amelia, M.Psi."
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            className="w-full px-3.5 py-2.5 border rounded-xl text-sm mt-1 focus:ring-2 focus:ring-blue-100 outline-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-semibold text-slate-700">Email Resmi Psikolog *</label>
                            <input
                                type="email"
                                required
                                placeholder="sarah.amelia@gmail.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-3.5 py-2.5 border rounded-xl text-sm mt-1 focus:ring-2 focus:ring-blue-100 outline-none"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-slate-700">Nomor HP / WhatsApp *</label>
                            <input
                                type="text"
                                required
                                placeholder="081234567890"
                                value={formData.phoneNumber}
                                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                className="w-full px-3.5 py-2.5 border rounded-xl text-sm mt-1 focus:ring-2 focus:ring-blue-100 outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-slate-700">Password Sementara Auto-Generated</label>
                        <div className="relative mt-1">
                            <input
                                type="text"
                                readOnly
                                value={formData.temporaryPassword}
                                className="w-full px-3.5 py-2.5 bg-slate-100 border rounded-xl text-sm font-mono font-semibold text-slate-700 cursor-not-allowed"
                            />
                            <Lock className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <button type="button" onClick={onClose} className="px-5 py-2.5 border rounded-xl text-sm hover:bg-slate-50 cursor-pointer">Batal</button>
                        <button type="submit" disabled={loading} className="px-5 py-2.5 bg-[#234463] text-white rounded-xl text-sm font-medium hover:bg-[#2B5379] transition cursor-pointer">
                            {loading ? "Menyimpan & Mengirim Email..." : "Simpan & Kirim Email"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function EditPsychologistModal({ initialData, onClose, onSuccess }: { initialData: any; onClose: () => void; onSuccess: (data: any) => void }) {
    const [formData, setFormData] = useState({ ...initialData });

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = typeof window !== "undefined" ? localStorage.getItem("token") || "" : "";

        try {
            const res = await fetch(`${API_BASE_URL}/admin/psychologists/${formData.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                credentials: "include",
                body: JSON.stringify({
                    fullName: formData.fullName,
                    email: formData.email,
                    phoneNumber: formData.phoneNumber,
                    sipp: formData.sipp,
                    str: formData.str || undefined,
                }),
            });

            const result = await res.json();

            if (!res.ok) {
                const errMsg = Array.isArray(result.message) ? result.message.join(", ") : result.message;
                throw new Error(errMsg || "Gagal memperbarui data psikolog");
            }

            onSuccess(formData);
            onClose();
        } catch (err: any) {
            alert(err.message || "Gagal memperbarui data psikolog");
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 font-poppins">
            <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6">
                <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                    <h3 className="text-xl font-bold text-[#234463] flex items-center gap-2">
                        <Pencil size={20} /> Edit Data Psikolog
                    </h3>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full cursor-pointer"><X size={20} /></button>
                </div>
                <form onSubmit={handleUpdate} className="space-y-4">
                    <div>
                        <label className="text-xs font-semibold text-slate-700">Nama Lengkap & Gelar</label>
                        <input type="text" required value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} className="w-full px-3.5 py-2.5 border rounded-xl text-sm mt-1 focus:ring-2 focus:ring-blue-100 outline-none" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-semibold text-slate-700">Email Psikolog *</label>
                            <input 
                                type="email" 
                                required 
                                value={formData.email || ""} 
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                                className="w-full px-3.5 py-2.5 border rounded-xl text-sm mt-1 focus:ring-2 focus:ring-blue-100 outline-none" 
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-slate-700">Nomor HP / WhatsApp</label>
                            <input type="text" required value={formData.phoneNumber || ""} onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })} className="w-full px-3.5 py-2.5 border rounded-xl text-sm mt-1 focus:ring-2 focus:ring-blue-100 outline-none" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-semibold text-slate-700">No. SIPP</label>
                            <input type="text" required value={formData.sipp} onChange={(e) => setFormData({ ...formData, sipp: e.target.value })} className="w-full px-3.5 py-2.5 border rounded-xl text-sm mt-1 focus:ring-2 focus:ring-blue-100 outline-none" />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-slate-700">No. STR</label>
                            <input type="text" value={formData.str || ""} onChange={(e) => setFormData({ ...formData, str: e.target.value })} className="w-full px-3.5 py-2.5 border rounded-xl text-sm mt-1 focus:ring-2 focus:ring-blue-100 outline-none" />
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <button type="button" onClick={onClose} className="px-5 py-2.5 border rounded-xl text-sm cursor-pointer hover:bg-slate-50">Batal</button>
                        <button type="submit" className="px-5 py-2.5 bg-[#234463] text-white rounded-xl text-sm font-medium hover:bg-[#2B5379] transition cursor-pointer">Simpan Perubahan</button>
                    </div>
                </form>
            </div>
        </div>
    );
}