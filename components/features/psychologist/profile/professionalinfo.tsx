"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, X, Save, GraduationCap, Edit2 } from "lucide-react";
import type { Psychologist } from "@/lib/types/psychologist";
import { updatePsychologistProfile } from "@/lib/api/psychologist";

const UNIVERSITAS_OPTIONS = [
  "Universitas Indonesia (UI)", "Universitas Gadjah Mada (UGM)", "Universitas Airlangga (UNAIR)",
  "Universitas Padjadjaran (UNPAD)", "Universitas Brawijaya (UB)", "Universitas Diponegoro (UNDIP)",
  "Universitas Sebelas Maret (UNS)", "Universitas Muhammadiyah Malang (UMM)", "Universitas Islam Indonesia (UII)"
];

const GELAR_OPTIONS = [
  "S1 Psikologi (S.Psi)", "S2 Psikologi Terapan (M.Psi)", "S2 Psikologi Profesi (M.Psi., Psikolog)", "S3 Doktor Psikologi (Dr.)"
];

const KOTA_OPTIONS = ["Jakarta", "Surabaya", "Bandung", "Yogyakarta", "Malang", "Semarang", "Surakarta", "Medan", "Makassar"];
const TAHUN_OPTIONS = Array.from({ length: 30 }, (_, i) => String(2026 - i));

export default function ProfessionalInfo({ psychologist, onUpdate }: { psychologist: Psychologist; onUpdate?: () => void }) {
  const [loadingEdu, setLoadingEdu] = useState(false);
  const [loadingPro, setLoadingPro] = useState(false);

  const [educationList, setEducationList] = useState<any[]>([]);
  const [showEduForm, setShowEduForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Form Temp
  const [eduTemp, setEduTemp] = useState({ institution: "", degree: "", startYear: "", endYear: "", city: "" });

  const [specializations, setSpecializations] = useState<string[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [experiences, setExperiences] = useState<string[]>([]);

  const [inputSpec, setInputSpec] = useState("");
  const [inputSkill, setInputSkill] = useState("");
  const [inputExp, setInputExp] = useState("");

  useEffect(() => {
    if (psychologist) {
      const rawEdu = (psychologist as any)?.education || (psychologist as any)?.educations || [];
      if (Array.isArray(rawEdu)) {
        setEducationList(
          rawEdu.map((e: any) => ({
            institution: e.institution || "",
            degree: e.degree || "",
            startYear: String(e.startYear || ""),
            endYear: String(e.endYear || ""),
            city: e.city || "",
          }))
        );
      }

      const rawSpec = (psychologist as any)?.specialization || (psychologist as any)?.specializations || [];
      if (Array.isArray(rawSpec)) setSpecializations(rawSpec.map((s: any) => (typeof s === "object" ? s.name : s)));

      const rawExp = (psychologist as any)?.expertises || (psychologist as any)?.expertise || [];
      if (Array.isArray(rawExp)) setSkills(rawExp.map((e: any) => (typeof e === "object" ? e.name : e)));

      const rawExperiences = (psychologist as any)?.experiences || (psychologist as any)?.experienceList || [];
      if (Array.isArray(rawExperiences)) setExperiences(rawExperiences.map((ex: any) => (typeof ex === "object" ? ex.name : ex)));
    }
  }, [psychologist]);

  const handleAddChip = (val: string, list: string[], setList: (v: string[]) => void, setInput: (v: string) => void) => {
    if (val.trim() && !list.includes(val.trim())) {
      setList([...list, val.trim()]);
      setInput("");
    }
  };

  // 🟢 HANDLE TAMBAH/EDIT ITEM PENDIDIKAN
  const handleSaveEduItem = () => {
    if (!eduTemp.institution.trim()) return alert("Nama universitas/institusi wajib diisi");

    let updatedList = [...educationList];
    if (editingIndex !== null) {
      updatedList[editingIndex] = eduTemp;
    } else {
      updatedList.push(eduTemp);
    }

    setEducationList(updatedList);
    setEduTemp({ institution: "", degree: "", startYear: "", endYear: "", city: "" });
    setShowEduForm(false);
    setEditingIndex(null);
  };

  const handleEditEdu = (idx: number) => {
    setEduTemp(educationList[idx]);
    setEditingIndex(idx);
    setShowEduForm(true);
  };

  const handleDeleteEdu = (idx: number) => {
    setEducationList(educationList.filter((_, i) => i !== idx));
  };

  // 🟢 SIMPAN KE BACKEND
  const handleSaveEducation = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingEdu(true);

    try {
      await updatePsychologistProfile({ education: educationList });
      alert("Riwayat Pendidikan berhasil disimpan!");
      if (onUpdate) await onUpdate();
    } catch (err: any) {
      alert(err.message || "Gagal menyimpan pendidikan.");
    } finally {
      setLoadingEdu(false);
    }
  };

  const handleSaveProfessional = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingPro(true);

    try {
      await updatePsychologistProfile({
        specializations: specializations,
        expertises: skills,
        experiences: experiences,
      });
      alert("Info Profesional berhasil disimpan!");
      if (onUpdate) await onUpdate();
    } catch (err: any) {
      alert(err.message || "Gagal menyimpan info profesional.");
    } finally {
      setLoadingPro(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full items-stretch font-poppins text-xs">
      
      {/* 🟢 PANEL PENDIDIKAN (BORDER TEBAL & TINGGI SEJAJAR) */}
      <div className="bg-white p-5 rounded-2xl border-2 border-slate-500 shadow-xs flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          <div className="w-full bg-[#1F415F] text-white py-2 rounded-full text-center font-semibold text-xs tracking-wide">
            Pendidikan
          </div>

          {/* LIST PENDIDIKAN RINGKAS */}
          <div className="space-y-2">
            {educationList.length === 0 && !showEduForm && (
              <p className="text-center text-gray-400 py-6 italic">Belum ada riwayat pendidikan yang ditambahkan.</p>
            )}

            {educationList.map((edu, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl hover:border-slate-300 transition">
                <div className="flex items-start gap-2.5">
                  <GraduationCap className="w-4 h-4 text-[#1F415F] mt-0.5 shrink-0" />
                  <div>
                    <p className="font-bold text-[#1F415F]">{edu.degree || "Gelar -"} — {edu.institution}</p>
                    <p className="text-[11px] text-gray-500">{edu.city ? `${edu.city} • ` : ""}{edu.startYear} - {edu.endYear}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button type="button" onClick={() => handleEditEdu(idx)} className="p-1.5 text-gray-400 hover:text-[#1F415F] cursor-pointer">
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button type="button" onClick={() => handleDeleteEdu(idx)} className="p-1.5 text-red-400 hover:text-red-600 cursor-pointer">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* FORM INPUT PENDIDIKAN */}
          {showEduForm ? (
            <div className="p-4 bg-slate-50 rounded-xl border border-blue-200 space-y-3 mt-3">
              <div className="flex justify-between items-center pb-1 border-b border-gray-200">
                <span className="font-bold text-[#1F415F]">{editingIndex !== null ? "Edit Pendidikan" : "Tambah Pendidikan"}</span>
                <button type="button" onClick={() => { setShowEduForm(false); setEditingIndex(null); }} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-gray-600 block">Institusi / Universitas *</label>
                <input 
                  type="text" 
                  list="univ-options" 
                  placeholder="Pilih atau ketik nama universitas..." 
                  value={eduTemp.institution} 
                  onChange={(e) => setEduTemp({ ...eduTemp, institution: e.target.value })} 
                  className="w-full p-2.5 border border-slate-300 rounded-lg bg-white outline-none focus:border-[#1F415F]" 
                />
                <datalist id="univ-options">
                  {UNIVERSITAS_OPTIONS.map((u, i) => <option key={i} value={u} />)}
                </datalist>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-gray-600 block">Gelar *</label>
                <input
                  type="text"
                  list="gelar-options"
                  placeholder="Pilih atau ketik gelar..."
                  value={eduTemp.degree}
                  onChange={(e) => setEduTemp({ ...eduTemp, degree: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-lg bg-white outline-none focus:border-[#1F415F]"
                />
                <datalist id="gelar-options">
                  {GELAR_OPTIONS.map((g, i) => <option key={i} value={g} />)}
                </datalist>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-gray-600 block">Tahun Mulai</label>
                  <select value={eduTemp.startYear} onChange={(e) => setEduTemp({ ...eduTemp, startYear: e.target.value })} className="w-full p-2.5 border border-slate-300 rounded-lg bg-white outline-none cursor-pointer">
                    <option value="">Mulai</option>
                    {TAHUN_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-gray-600 block">Tahun Selesai</label>
                  <select value={eduTemp.endYear} onChange={(e) => setEduTemp({ ...eduTemp, endYear: e.target.value })} className="w-full p-2.5 border border-slate-300 rounded-lg bg-white outline-none cursor-pointer">
                    <option value="">Selesai</option>
                    {TAHUN_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-gray-600 block">Kota / Negara</label>
                <input 
                  type="text" 
                  list="city-options" 
                  placeholder="Pilih atau ketik kota/negara..." 
                  value={eduTemp.city} 
                  onChange={(e) => setEduTemp({ ...eduTemp, city: e.target.value })} 
                  className="w-full p-2.5 border border-slate-300 rounded-lg bg-white outline-none focus:border-[#1F415F]" 
                />
                <datalist id="city-options">
                  {KOTA_OPTIONS.map((k, i) => <option key={i} value={k} />)}
                </datalist>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => { setShowEduForm(false); setEditingIndex(null); }} className="px-3.5 py-1.5 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-100">Batal</button>
                <button type="button" onClick={handleSaveEduItem} className="px-3.5 py-1.5 bg-[#1F415F] text-white rounded-lg font-semibold hover:bg-[#18334b]">Terapkan</button>
              </div>
            </div>
          ) : (
            <button type="button" onClick={() => { setEduTemp({ institution: "", degree: "", startYear: "", endYear: "", city: "" }); setShowEduForm(true); }} className="w-full py-2.5 bg-slate-50 border border-dashed border-slate-300 hover:border-[#1F415F] text-[#1F415F] font-semibold rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer">
              <Plus className="w-4 h-4" /> Tambah Pendidikan
            </button>
          )}
        </div>

        {/* TOMBOL SIMPAN PENDIDIKAN DI BAWAH */}
        <form onSubmit={handleSaveEducation} className="flex justify-end pt-3 border-t border-slate-100 mt-auto">
          <button type="submit" disabled={loadingEdu} className="px-4 py-2 bg-[#1F415F] text-white font-semibold rounded-lg hover:bg-[#18334b] transition flex items-center gap-1.5 cursor-pointer shadow-xs">
            <Save className="w-4 h-4" />
            <span>{loadingEdu ? "Menyimpan..." : "Simpan Pendidikan"}</span>
          </button>
        </form>
      </div>

      {/* 🟢 PANEL PROFESSIONAL INFO (BORDER TEBAL & TINGGI SEJAJAR) */}
      <form onSubmit={handleSaveProfessional} className="w-full bg-white rounded-2xl border-2 border-slate-500 p-5 shadow-xs flex flex-col justify-between space-y-4">
        <div className="space-y-4">
          <div className="w-full bg-[#1F415F] text-white py-2 rounded-full text-center font-semibold text-xs tracking-wide">
            Professional Info
          </div>

          <div className="space-y-4 pt-1">
            {/* Spesialisasi */}
            <div className="space-y-2">
              <label className="font-bold text-gray-700 block">Spesialisasi *</label>
              <div className="flex flex-wrap gap-2">
                {specializations.map((spec, idx) => (
                  <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-[#1F415F] rounded-full text-xs font-semibold border border-blue-200">
                    {spec}
                    <button type="button" onClick={() => setSpecializations(specializations.filter((_, i) => i !== idx))} className="hover:text-red-500 cursor-pointer"><X className="w-3.5 h-3.5" /></button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2 w-full pt-1">
                <input type="text" placeholder="Tambah spesialisasi..." value={inputSpec} onChange={(e) => setInputSpec(e.target.value)} className="flex-1 p-2.5 border border-slate-300 rounded-lg outline-none focus:border-[#1F415F]" />
                <button type="button" onClick={() => handleAddChip(inputSpec, specializations, setSpecializations, setInputSpec)} className="px-4 py-2 bg-[#1F415F] text-white rounded-lg hover:bg-[#18334b] cursor-pointer font-semibold shrink-0 shadow-xs">Tambah</button>
              </div>
            </div>

            {/* Keahlian */}
            <div className="space-y-2 pt-2 border-t border-gray-100">
              <label className="font-bold text-gray-700 block">Keahlian *</label>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, idx) => (
                  <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full text-xs font-semibold border border-emerald-200">
                    {skill}
                    <button type="button" onClick={() => setSkills(skills.filter((_, i) => i !== idx))} className="hover:text-red-500 cursor-pointer"><X className="w-3.5 h-3.5" /></button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2 w-full pt-1">
                <input type="text" placeholder="Tambah keahlian..." value={inputSkill} onChange={(e) => setInputSkill(e.target.value)} className="flex-1 p-2.5 border border-slate-300 rounded-lg outline-none focus:border-[#1F415F]" />
                <button type="button" onClick={() => handleAddChip(inputSkill, skills, setSkills, setInputSkill)} className="px-4 py-2 bg-[#1F415F] text-white rounded-lg hover:bg-[#18334b] cursor-pointer font-semibold shrink-0 shadow-xs">Tambah</button>
              </div>
            </div>

            {/* Pengalaman */}
            <div className="space-y-2 pt-2 border-t border-gray-100">
              <label className="font-bold text-gray-700 block">Pengalaman *</label>
              <div className="flex flex-wrap gap-2">
                {experiences.map((exp, idx) => (
                  <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 text-purple-800 rounded-full text-xs font-semibold border border-purple-200">
                    {exp}
                    <button type="button" onClick={() => setExperiences(experiences.filter((_, i) => i !== idx))} className="hover:text-red-500 cursor-pointer"><X className="w-3.5 h-3.5" /></button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2 w-full pt-1">
                <input type="text" placeholder="Tambah pengalaman..." value={inputExp} onChange={(e) => setInputExp(e.target.value)} className="flex-1 p-2.5 border border-slate-300 rounded-lg outline-none focus:border-[#1F415F]" />
                <button type="button" onClick={() => handleAddChip(inputExp, experiences, setExperiences, setInputExp)} className="px-4 py-2 bg-[#1F415F] text-white rounded-lg hover:bg-[#18334b] cursor-pointer font-semibold shrink-0 shadow-xs">Tambah</button>
              </div>
            </div>
          </div>
        </div>

        {/* TOMBOL SIMPAN INFO PROFESIONAL DI BAWAH */}
        <div className="flex justify-end pt-3 border-t border-slate-100 mt-auto">
          <button type="submit" disabled={loadingPro} className="px-4 py-2 bg-[#1F415F] text-white font-semibold rounded-lg hover:bg-[#18334b] transition cursor-pointer flex items-center gap-1.5 shadow-xs">
            <Save className="w-4 h-4" />
            <span>{loadingPro ? "Menyimpan..." : "Simpan Info Profesional"}</span>
          </button>
        </div>
      </form>

    </div>
  );
}