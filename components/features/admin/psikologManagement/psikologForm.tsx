'use client'
import { useState, useRef, useEffect } from "react"
import {User, Pencil, Camera, Upload, Crop, Image as ImageIcon } from "lucide-react";
import {Trash2, Plus, X, AlertCircle, Check } from 'lucide-react';
import CustomCalendar from "@/components/common/calendar";
import Cropper from "react-easy-crop";
import { validateEmail } from "@/lib/email";

interface Education {
    id: string;
    university: string;
    degree: string;
    startYear: string;
    endYear: string;
    city: string;
}

interface Experience {
    id: string;
    title: string;
}

interface Schedule {
    id: string;
    date: string;
    startTime: string;
    duration: number;
}

export interface PsychologistData {
    name: string;
    email: string;
    licenseNumber: string; //SIPP/SILP
    str: string;
    bio: string;
    educations: Education[];
    specializations: Experience[];
    expertise: Experience[];
    experiences: Experience[];
    schedules: Schedule[];
    photo?: string | null;
}

interface PsychologistFormProps {
    initialData?: PsychologistData;
    onSubmit: (data: PsychologistData, photoFile?: File) => void;
    onDirtyChange?: (dirty: boolean) => void;
}

const PsychologistForm: React.FC<PsychologistFormProps> = ({ 
    initialData, 
    onSubmit, 
    onDirtyChange
}) => {
    // Basic Info States
    const [photo, setPhoto] = useState<string | null>(initialData?.photo ?? null);
    const [showPhotoAction, setShowPhotoAction] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [crop, setCrop] = useState({x: 0, y:0});
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null)
    const [showCropper, setShowCropper] = useState(false)
    const [str, setStr] = useState(initialData?.str || '');
    const [photoFile, setPhotoFile] = useState<File | null>(null);


    const photoRef = useRef<HTMLDivElement>(null);
    const nameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const licenseRef = useRef<HTMLInputElement>(null);
    const bioRef = useRef<HTMLTextAreaElement>(null);
    const educationRef = useRef<HTMLDivElement>(null);
    const specializationRef = useRef<HTMLInputElement>(null);
    const expertiseRef = useRef<HTMLInputElement>(null);
    const experienceRef = useRef<HTMLInputElement>(null);
    const scheduleRef = useRef<HTMLDivElement>(null);
    
    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setPhotoFile(file);

        const reader = new FileReader();
        reader.onloadend = () => {
            setPhoto(reader.result as string); 
            setShowCropper(true);
        };
        reader.readAsDataURL(file);
    };

    const [name, setName] = useState(initialData?.name || '');
    const [email, setEmail] = useState(initialData?.email || '');
    const [licenseNumber, setLicenseNumber] = useState(initialData?.licenseNumber || '');
    const [bio, setBio] = useState(initialData?.bio || '');
    // const [consultationFee, setConsultationFee] = useState(initialData?.consultationFee || '');

    // Education States
    const [educations, setEducations] = useState<Education[]>(initialData?.educations || []);
    const [university, setUniversity] = useState('');
    const [degree, setDegree] = useState('');
    const [startYear, setStartYear] = useState('');
    const [endYear, setEndYear] = useState('');
    const [city, setCity] = useState('');
    const [editingEducationId, setEditingEducationId] = useState<string | null>(null);

    // Specialization States
    const [specializations, setSpecializations] = useState<Experience[]>(initialData?.specializations || []);
    const [specializationInput, setSpecializationInput] = useState('');
    const [editingSpecializationId, setEditingSpecializationId] = useState<string | null>(null);

    // Expertise States
    const [expertise, setExpertise] = useState<Experience[]>(initialData?.expertise || []);
    const [expertiseInput, setExpertiseInput] = useState('');
    const [editingExpertiseId, setEditingExpertiseId] = useState<string | null>(null);

    // Experience States
    const [experiences, setExperiences] = useState<Experience[]>(initialData?.experiences || []);
    const [experienceInput, setExperienceInput] = useState('');
    const [editingExperienceId, setEditingExperienceId] = useState<string | null>(null);

    // Schedule States
    const [schedules, setSchedules] = useState<Schedule[]>(initialData?.schedules || []);
    const [scheduleDate, setScheduleDate] = useState('');
    const [scheduleTime, setScheduleTime] = useState('');
    const [scheduleDuration, setScheduleDuration] = useState('');
    const [editingScheduleId, setEditingScheduleId] = useState<string | null>(null);

    // Hover States
    const [hoveredEducationId, setHoveredEducationId] = useState<string | null>(null);
    const [hoveredSpecializationId, setHoveredSpecializationId] = useState<string | null>(null);
    const [hoveredExpertiseId, setHoveredExpertiseId] = useState<string | null>(null);
    const [hoveredExperienceId, setHoveredExperienceId] = useState<string | null>(null);
    const [hoveredScheduleId, setHoveredScheduleId] = useState<string | null>(null);

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showErrorToast, setShowErrorToast] = useState(false);

    useEffect(() => {
        onDirtyChange?.(true);
    }, [
        name,
        email,
        licenseNumber,
        bio,
        educations,
        specializations,
        expertise,
        experiences,
        schedules,
        // consultationFee,
        photo
    ]);

    // Education Handlers
    const handleAddEducation = () => {
        if (!university || !degree || !startYear || !endYear || !city) {
            setErrors(prev => ({
                ...prev,
                educations: 'Mohon lengkapi semua field pendidikan'
            }));
            return;
        }

        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors.educations;
            return newErrors;
        });

        if (editingEducationId) {
        setEducations(educations.map(edu => 
            edu.id === editingEducationId 
            ? { id: edu.id, university, degree, startYear, endYear, city }
            : edu
        ));
        setEditingEducationId(null);
        } else {
        const newEducation: Education = {
            id: Date.now().toString(),
            university,
            degree,
            startYear,
            endYear,
            city
        };
        setEducations([...educations, newEducation]);
        }

        // Reset form
        setUniversity('');
        setDegree('');
        setStartYear('');
        setEndYear('');
        setCity('');
    };

    const handleEditEducation = (edu: Education) => {
        setUniversity(edu.university);
        setDegree(edu.degree);
        setStartYear(edu.startYear);
        setEndYear(edu.endYear);
        setCity(edu.city);
        setEditingEducationId(edu.id);
    };

    const handleDeleteEducation = (id: string) => {
        if (editingEducationId === id) {
            setUniversity('');
            setDegree('');
            setStartYear('');
            setEndYear('');
            setCity('');
            setEditingEducationId(null);
        }
        setEducations(educations.filter(edu => edu.id !== id));
    };

    // Specialization Handlers
    const handleAddSpecialization = () => {
        if (!specializationInput.trim()) {
            setErrors(prev => ({
                ...prev,
                specializations: 'Mohon isi spesialisasi terlebih dahulu'
            }));
            return;
        }

        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors.specializations;
            return newErrors;
        });

        if (editingSpecializationId) {
        setSpecializations(specializations.map(spec => 
            spec.id === editingSpecializationId 
            ? { id: spec.id, title: specializationInput }
            : spec
        ));
        setEditingSpecializationId(null);
        } else {
        const newSpec: Experience = {
            id: Date.now().toString(),
            title: specializationInput
        };
        setSpecializations([...specializations, newSpec]);
        }
        setSpecializationInput('');
    };

    const handleEditSpecialization = (spec: Experience) => {
        setSpecializationInput(spec.title);
        setEditingSpecializationId(spec.id);
    };

    const handleDeleteSpecialization = (id: string) => {
        if (editingSpecializationId === id) {
            setSpecializationInput('');
            setEditingSpecializationId(null);
        }
        setSpecializations(specializations.filter(spec => spec.id !== id));
    };

    // Expertise Handlers
    const handleAddExpertise = () => {
        if (!expertiseInput.trim()) {
            setErrors(prev => ({
                ...prev,
                expertise: 'Mohon isi keahlian terlebih dahulu'
            }))
            return;
        }
        
        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors.expertise;
            return newErrors;
        });

        if (editingExpertiseId) {
        setExpertise(expertise.map(exp => 
            exp.id === editingExpertiseId 
            ? { id: exp.id, title: expertiseInput }
            : exp
        ));
        setEditingExpertiseId(null);
        } else {
        const newExp: Experience = {
            id: Date.now().toString(),
            title: expertiseInput
        };
        setExpertise([...expertise, newExp]);
        }
        setExpertiseInput('');
    };

    const handleEditExpertise = (exp: Experience) => {
        setExpertiseInput(exp.title);
        setEditingExpertiseId(exp.id);
    };

    const handleDeleteExpertise = (id: string) => {
        if (editingExpertiseId === id) {
            setExpertiseInput('');
            setEditingExpertiseId(null);
        }
        setExpertise(expertise.filter(exp => exp.id !== id));
    };

    // Experience Handlers
    const handleAddExperience = () => {
        if (!experienceInput.trim()) {
            setErrors(prev => ({
                ...prev,
                experiences: 'Mohon isi pengalaman terlebih dahulu'
            }));
            return;
        }

        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors.experiences;
            return newErrors;
        });
        
        if (editingExperienceId) {
        setExperiences(experiences.map(exp => 
            exp.id === editingExperienceId 
            ? { id: exp.id, title: experienceInput }
            : exp
        ));
        setEditingExperienceId(null);
        } else {
        const newExp: Experience = {
            id: Date.now().toString(),
            title: experienceInput
        };
        setExperiences([...experiences, newExp]);
        }
        setExperienceInput('');
    };

    const handleEditExperience = (exp: Experience) => {
        setExperienceInput(exp.title);
        setEditingExperienceId(exp.id);
    };

    const handleDeleteExperience = (id: string) => {
        if (editingExperienceId === id) {
            setExperienceInput('');
            setEditingExperienceId(null);
        }
        setExperiences(experiences.filter(exp => exp.id !== id));
    };

    // Schedule Handlers
    const handleAddSchedule = () => {
        if (!scheduleDate || !scheduleTime || !scheduleDuration) {
            setErrors(prev => ({
                ...prev,
                schedules: 'Mohon lengkapi semua field jadwal praktik'
            }));
            return;
        }

        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors.schedules;
            return newErrors;
        });

        if (editingScheduleId) {
        setSchedules(schedules.map(sch => 
            sch.id === editingScheduleId 
            ? { id: sch.id, date: scheduleDate, startTime: scheduleTime, duration: parseInt(scheduleDuration) }
            : sch
        ));
        setEditingScheduleId(null);
        } else {
        const newSchedule: Schedule = {
            id: Date.now().toString(),
            date: scheduleDate,
            startTime: scheduleTime,
            duration: parseInt(scheduleDuration)
        };
        setSchedules([...schedules, newSchedule]);
        }

        setScheduleDate('');
        setScheduleTime('');
        setScheduleDuration('');
    };

    const handleEditSchedule = (sch: Schedule) => {
        setScheduleDate(sch.date);
        setScheduleTime(sch.startTime);
        setScheduleDuration(sch.duration.toString());
        setEditingScheduleId(sch.id);
    };

    const handleDeleteSchedule = (id: string) => {
        if (editingScheduleId === id) {
            setScheduleDate('');
            setScheduleTime('');
            setScheduleDuration('');
            setEditingScheduleId(null);
        }
        setSchedules(schedules.filter(sch => sch.id !== id));
    };

    const scrollToError = (fieldName: string) => {
        const refMap: Record<string, React.RefObject<any>> = {
            photo: photoRef,
            name: nameRef,
            email: emailRef,
            licenseNumber: licenseRef,
            bio: bioRef,
            educations: educationRef,
            specializations: specializationRef,
            expertise: experienceRef,
            experiences: expertiseRef,
            schedules: scheduleRef,
            // consultationFee: consultationFeeRef,
        };

        const ref = refMap[fieldName];
        if (ref?.current) {
            ref.current.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
            
            // Focus if it's an input element
            if (ref.current.focus) {
                setTimeout(() => ref.current.focus(), 500);
            }
        }
    };

    //Submit
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const pendingEducation = university && degree && startYear && endYear && city
            ? {
                id: Date.now().toString(),
                university,
                degree,
                startYear,
                endYear,
                city
            }
            : null;

        const pendingSpecialization = specializationInput.trim()
            ? {
                id: Date.now().toString(),
                title: specializationInput
            }
            : null;

        const pendingExpertise = expertiseInput.trim()
            ? {
                id: Date.now().toString(),
                title: expertiseInput
            }
            : null;

        const pendingExperience = experienceInput.trim()
            ? {
                id: Date.now().toString(),
                title: experienceInput
            }
            : null;

        const pendingSchedule = scheduleDate && scheduleTime && scheduleDuration
            ? {
                id: Date.now().toString(),
                date: scheduleDate,
                startTime: scheduleTime,
                duration: parseInt(scheduleDuration)
            }
            : null;

        const finalEducations = pendingEducation 
            ? [...educations, pendingEducation] 
            : educations;

        const finalSpecializations = pendingSpecialization 
            ? [...specializations, pendingSpecialization] 
            : specializations;

        const finalExpertise = pendingExpertise 
            ? [...expertise, pendingExpertise] 
            : expertise;

        const finalExperiences = pendingExperience 
            ? [...experiences, pendingExperience] 
            : experiences;

        const finalSchedules = pendingSchedule 
            ? [...schedules, pendingSchedule] 
            : schedules;
        
        const newErrors: Record<string, string> = {};

        if (!photo) newErrors.photo = "Foto profil wajib diunggah";
        if (!name.trim()) newErrors.name = "Nama wajib diisi";

        const emailError = validateEmail(email);
        if (emailError) {
            newErrors.email = emailError;
        }

        if (!licenseNumber.trim()) newErrors.licenseNumber = "Nomor sertifikasi wajib diisi";
        if (!str.trim()) newErrors.str = "STR wajib diisi";
        if (!bio.trim()) newErrors.bio = "Deskripsi wajib diisi";

        if (finalEducations.length === 0) {
            newErrors.educations = "Minimal 1 pendidikan harus diisi";
        }

        if (finalSpecializations.length === 0) {
            newErrors.specializations = "Spesialisasi harus diisi";
        }

        if (finalExpertise.length === 0) {
            newErrors.expertise = "Minimal 1 keahlian harus diisi";
        }

        if (finalExperiences.length === 0) {
            newErrors.experiences = "Minimal 1 pengalaman harus diisi";
        }

        if (finalSchedules.length === 0) {
            newErrors.schedules = "Minimal 1 jadwal praktik harus diisi";
        }

        // if (!consultationFee.trim()) {
        //     newErrors.consultationFee = "Biaya konsultasi wajib diisi";
        // } else if (parseFloat(consultationFee) <= 0) {
        //     newErrors.consultationFee = "Biaya konsultasi harus lebih dari 0";
        // }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setShowErrorToast(true);
            const firstErrorField = Object.keys(newErrors)[0];
            scrollToError(firstErrorField);
            setTimeout(() => setShowErrorToast(false), 3000);
            return;
        }

        // 🟢 Konversi array of object [{ title }] menjadi array string simple ["..."] agar pas dengan NestJS
        const formattedSpecializations = finalSpecializations.map((s) => s.title);
        const formattedExpertise = finalExpertise.map((e) => e.title);
        const formattedExperiences = finalExperiences.map((ex) => ex.title);

        const formData: any = {
            fullName: name,
            email: email,
            sipp: licenseNumber, // 👈 SIPP untuk NestJS
            str: str,
            about: bio,         // 👈 NestJS membaca bio sebagai 'about'
            educations: finalEducations,
            specializations: formattedSpecializations, // 👈 Array string
            expertises: formattedExpertise,            // 👈 Array string
            experiences: formattedExperiences,          // 👈 Array string
            schedules: finalSchedules.map((sch) => ({
                date: sch.date,
                startTime: sch.startTime,
                duration: sch.duration,
                isAvailable: true,
            })),
            photo,
        };
        
        // Kirim formData dan file foto ke handler parent
        onSubmit(formData, photoFile ?? undefined);
        onDirtyChange?.(false);
        setErrors({});
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
        
        return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]}`;
    };

    useEffect(() => {
        if (!initialData) {
            setName('');
            setEmail('');
            setLicenseNumber('');
            setBio('');
            // setConsultationFee('');
            setEducations([]);
            setSpecializations([]);
            setExpertise([]);
            setExperiences([]);
            setSchedules([]);
            setPhoto(null);
            return;
        }

        setName(initialData.name);
        setEmail(initialData.email);
        setLicenseNumber(initialData.licenseNumber);
        setBio(initialData.bio);
        setEducations(initialData.educations || []);
        setSpecializations(initialData.specializations || []);
        setExpertise(initialData.expertise || []);
        setExperiences(initialData.experiences || []);
        setSchedules(initialData.schedules || []);
        setPhoto(initialData.photo || null);
    }, [initialData]);

    // Clear error when user starts typing
    const clearError = (field: string) => {
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const getCroppedImg = async (imageSrc: string, crop: any) => {
        const image = new Image()
        image.crossOrigin = 'anonymous';
        image.src = imageSrc
        await new Promise((resolve) => (image.onload = resolve))

        const canvas = document.createElement('canvas')
        canvas.width = crop.width
        canvas.height = crop.height
        const ctx = canvas.getContext('2d')!

        ctx.drawImage(
            image,
            crop.x,
            crop.y,
            crop.width,
            crop.height,
            0,
            0,
            crop.width,
            crop.height
        )

        return canvas.toDataURL('image/jpeg')
    }

    const handleSaveCrop = async () => {
        if (!photo || !croppedAreaPixels) return;   

        const croppedImage = await getCroppedImg(photo, croppedAreaPixels)
        setPhoto(croppedImage)

        const res = await fetch(croppedImage);
        const blob = await res.blob();
        const croppedFile = new File([blob], photoFile?.name || 'avatar.jpg', {
            type: 'image/jpeg',
        });
        setPhotoFile(croppedFile);
        setShowCropper(false)
    }


    return (
        <div className="max-w-6xl mx-auto p-6 min-h-screen">
            {showErrorToast && (
                <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 pointer-events-none">
                    <div className="bg-white border border-gray-200 rounded-xl shadow-2xl p-2 flex items-center gap-3 max-w-md animate-slide-down pointer-events-auto">
                        <div className="p-2 bg-red-100 rounded-full">
                            <AlertCircle size={24} className="text-red-600" />
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold text-gray-900">Data tidak lengkap!</p>
                            <p className="text-sm text-gray-600">Mohon lengkapi semua field yang wajib diisi</p>
                        </div>
                        <button 
                            onClick={() => setShowErrorToast(false)}
                            className="p-1 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                        >
                            <X size={20} className="text-gray-400"/>
                        </button>
                    </div>
                </div>
            )}
            <form onSubmit={handleSubmit} noValidate className="space-y-6 flex flex-col lg:flex-row gap-8 ">
                <div className="flex flex-col justify-center items-center lg:justify-start">
                    <div className="relative w-28 h-28 sm:w-32 sm:h-32">
                        <div ref={photoRef} className="w-full h-full rounded-full  flex items-center justify-center overflow-hidden bg-gray-100">
                            {photo ? (
                                <img src={photo} alt="Profle" className="w-full h-full object-cover"/>
                            ): (
                                <User size={80} className=" text-gray-400"/>
                            )}
                        </div>

                        <button
                        type="button"
                        onClick={() => {
                            if (photo) {
                            setShowPhotoAction(true);
                            } else {
                            fileInputRef.current?.click(); 
                            }
                        }}
                        className="absolute bottom-1 right-1 bg-blue-900 p-2 rounded-full shadow hover:bg-blue-800 transition cursor-pointer"
                        >
                            <Pencil size={16} className=" text-white"/>
                        </button>

                        <input type="file" 
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleUpload}
                        className="hidden"
                        />
                    </div>
                    {errors.photo && (
                                <p className="mt-2 text-red-500 text-sm flex items-center gap-1 justify-center">
                                    <AlertCircle size={18} />
                                    {errors.photo}
                                </p>
                        )}
                </div>

                <div className="w-full space-y-8">
                    <div className="bg-white md:rounded-lg md:shadow-sm md:p-6">
                        {/* Personal Information */}
                        <div className="space-y-4">
                            <div className="rounded-xl bg-[#234463] py-1">
                                <h2 className="text-white font-bold text-center">Personal Information</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] items-center gap-2 md:gap-4">
                                <label className="flex text-sm font-bold text-[#234463]">
                                    Nama <span className="text-red-500 ml-1">*</span>
                                </label>
                                <input
                                ref={nameRef}
                                type="text"
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value);
                                    clearError('name');
                                }}
                                placeholder="Asti Amanah Agustini M. Psi, Psikolog"
                                className={`w-full px-4 py-2 border border-[#234463] rounded-md text-blue-950 focus:outline-none focus:ring-1 focus:border-transparent
                                    ${errors.name 
                                        ? 'border-red-500 focus:ring-red-200' 
                                        : 'border-[#234463] focus:ring-1'
                                    }`}
                                />

                                {errors.name && (
                                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                        <AlertCircle size={14} />
                                        {errors.name}
                                    </p>
                                )}

                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] items-center gap-2 md:gap-4">
                                <label className="flex text-sm font-bold text-[#234463]">
                                    Email <span className="text-red-500 ml-1">*</span>
                                </label>
                                <input
                                ref={emailRef}
                                type="email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    clearError('email');
                                }}
                                placeholder="asti.amanah@gmail.com"
                                className={`w-full px-4 py-2 border border-[#234463] rounded-md text-blue-950 focus:outline-none focus:ring-1 focus:border-transparent
                                    ${errors.email 
                                            ? 'border-red-500 focus:ring-red-200' 
                                            : 'border-[#234463] focus:ring-1'
                                    }`}
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                        <AlertCircle size={14} />
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] items-center gap-2 md:gap-4">
                                <label className="flex text-sm font-bold text-[#234463]">
                                    SIPP/SILP <span className="text-red-500 ml-1">*</span>
                                </label>
                                <input
                                ref={licenseRef}
                                type="text"
                                value={licenseNumber}
                                onChange={(e) => {
                                    setLicenseNumber(e.target.value);
                                    clearError("licenseNumber");
                                }}
                                placeholder="010015"
                                className={`w-full px-4 py-2 border border-[#234463] rounded-md text-blue-950 focus:outline-none focus:ring-1 focus:border-transparent
                                    ${errors.licenseNumber 
                                        ? 'border-red-500 focus:ring-red-200' 
                                        : 'border-[#234463] focus:ring-1'
                                    }`}
                                />

                                {errors.licenseNumber && (
                                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                        <AlertCircle size={14} />
                                        {errors.licenseNumber}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] items-center gap-2 md:gap-4">
                                <label className="flex text-sm font-bold text-[#234463]">
                                    STR <span className="text-red-500 ml-1">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={str}
                                    onChange={(e) => {
                                        setStr(e.target.value);
                                        clearError('str');
                                    }}
                                    placeholder="Nomor STR"
                                    className={`w-full px-4 py-2 border border-[#234463] rounded-md text-blue-950 focus:outline-none focus:ring-1 focus:border-transparent
                                        ${errors.str ? 'border-red-500 focus:ring-red-200' : 'border-[#234463] focus:ring-1'}`}
                                />
                                {errors.str && (
                                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                        <AlertCircle size={14} />{errors.str}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] items-center gap-2 md:gap-4">
                                <label className="flex text-sm font-bold text-[#234463]">
                                    Tentang Psikolog <span className="text-red-500 ml-1">*</span>
                                </label>
                                <textarea
                                ref={bioRef}
                                value={bio}
                                onChange={(e) => {
                                    setBio(e.target.value);
                                    clearError('bio');
                                }}
                                placeholder="Saya adalah seorang konselor klinis bersertifikat dengan lebih dari 10 tahun..."
                                rows={4}
                                className={`w-full px-4 py-2 border border-[#234463] rounded-md text-blue-950 focus:outline-none focus:ring-1 focus:border-transparent
                                    ${errors.bio 
                                        ? 'border-red-500 focus:ring-red-200' 
                                        : 'border-[#234463] focus:ring-1'
                                    }`}
                                />

                                {errors.bio && (
                                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                        <AlertCircle size={14} />
                                        {errors.bio}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/*Education*/}
                    <div ref={educationRef} className="bg-white md:rounded-lg md:shadow-sm md:p-6">
                        <div className="space-y-4">
                            <div className="rounded-xl bg-[#234463] py-1">
                                <h2 className="text-white font-bold text-center">Pendidikan</h2>
                            </div>

                            {errors.educations && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
                                    <AlertCircle size={20} className="text-red-500" />
                                    <p className="text-red-600 text-sm font-medium">{errors.educations}</p>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] items-center gap-2 md:gap-4">
                                <label className="flex text-sm font-semibold text-[#234463]">
                                    Pendidikan <span className="text-red-500 ml-1">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={university}
                                    onChange={(e) => setUniversity(e.target.value)}
                                    placeholder="Universitas/Akademi/Politeknik/Institusi"
                                    className="w-full px-4 py-2 border border-[#234463] rounded-md text-blue-950 focus:outline-none focus:ring-1 focus:border-transparent"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] items-center gap-2 md:gap-4">
                                <label className="flex text-sm font-semibold text-[#234463]">
                                    Gelar <span className="text-red-500 ml-1">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={degree}
                                    onChange={(e) => setDegree(e.target.value)}
                                    placeholder="(S1/S2/S3)"
                                    className="w-full px-4 py-2 border border-[#234463] rounded-md text-blue-950 focus:outline-none focus:ring-1 focus:border-transparent"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-3 md:gap-4">
                                <label className="flex text-sm font-semibold text-[#234463]">
                                    Periode Studi <span className="text-red-500 ml-1">*</span>
                                </label>
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                    type="text"
                                    value={startYear}
                                    onChange={(e) => {
                                        const clean = e.target.value.replace(/\D/g, "").slice(0, 4); 
                                        setStartYear(clean);
                                    }}
                                    placeholder="Tahun Mulai"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    className="px-4 py-2 border border-[#234463] rounded-md text-blue-950 focus:outline-none focus:ring-1 focus:border-transparent"
                                    />

                                    <input
                                    type="text"
                                    value={endYear}
                                    onChange={(e) => {
                                        const clean = e.target.value.replace(/\D/g, "").slice(0, 4); 
                                        setEndYear(clean);
                                    }}
                                    placeholder="Tahun Selesai"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    className="px-4 py-2 border border-[#234463] rounded-md text-blue-950 focus:outline-none focus:ring-1 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] items-center gap-2 md:gap-4">
                                <label className="flex text-sm font-semibold text-[#234463]">
                                    Kota <span className="text-red-500 ml-1">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    placeholder="Kota"
                                    className="w-full px-4 py-2 border border-[#234463] rounded-md text-blue-950 focus:outline-none focus:ring-1 focus:border-transparent"
                                />
                            </div>
                            
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={handleAddEducation}
                                    title={editingEducationId ? "Update Pendidikan" : "Tambah Pendidikan"}
                                    className="p-2 bg-[#1f3b5b] text-white rounded-full hover:bg-blue-900 transition-colors font-medium cursor-pointer"
                                    >
                                    {editingEducationId ? <Check size={18} /> : <Plus size={18} />}
                                </button>
                            </div>
                            {/* Education List */}
                            {educations.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {educations.map((edu) => (
                                    <div
                                        key={edu.id}
                                        className="relative border border-gray-300 rounded-full px-4 py-2 hover:border-[#234463] hover:bg-blue-50 transition-colors cursor-pointer"
                                        onClick={() => {
                                            handleEditEducation(edu);
                                            setHoveredEducationId(edu.id);
                                        }}
                                    >
                                        {hoveredEducationId === edu.id && (
                                            <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteEducation(edu.id);
                                            }}
                                            className="absolute -top-1 -right-1 p-1 bg-red-400 text-white rounded-full hover:bg-red-600 cursor-pointer"
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                        )}
                                        <div className="gap-2 text-sm">
                                            <p className="font-medium text-gray-700 text-center">{edu.degree}, {edu.university}, {edu.city},  {edu.endYear}</p>
                                        </div>
                                    </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/*Specialization, Expertise & Experience */}
                    <div className="bg-white md:rounded-lg md:shadow-sm md:p-6">
                        <div className="space-y-4">
                            <div className="rounded-xl bg-[#234463] py-1">
                                <h2 className="text-white font-bold text-center">Professional Info</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] items-center gap-2 md:gap-4">
                                <label className="flex text-sm font-bold text-[#234463]">
                                    Spesialisasi <span className="text-red-500 ml-1">*</span>
                                </label>
                                <input
                                ref={specializationRef}
                                type="text"
                                value={specializationInput}
                                onChange={(e) => {
                                    setSpecializationInput(e.target.value);
                                    clearError('specializations');
                                }}
                                placeholder="Masukkan spesialisasi"
                                className={`w-full px-4 py-2 border border-[#234463] rounded-md text-blue-950 focus:outline-none focus:ring-1 focus:border-transparent
                                    ${errors.specializations 
                                        ? 'border-red-500 focus:ring-red-200' 
                                        : 'border-[#234463] focus:ring-1'
                                    }`}
                                />
                                {errors.specializations && (
                                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                        <AlertCircle size={14} />
                                        {errors.specializations}
                                    </p>
                                )}
                            </div>

                            <div className="flex justify-end">
                                <button
                                type="button"
                                onClick={handleAddSpecialization}
                                title={editingSpecializationId ? 'Update Spesialisasi' : '+ Tambah Spesialisasi'}
                                className="p-2 bg-[#234463] text-white rounded-full hover:bg-blue-950 transition-colors font-medium cursor-pointer"
                                >
                                    {editingSpecializationId ? <Check size={18} /> : <Plus size={18} />}
                                </button>
                            </div>

                            {specializations.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-3">
                                {specializations.map((spec) => (
                                    <div
                                    key={spec.id}
                                    className="text-sm font-medium text-gray-700 relative border border-gray-300 rounded-full px-4 py-2 hover:border-[#234463] hover:bg-blue-50 transition-colors cursor-pointer"
                                    onClick={() => {
                                        handleEditSpecialization(spec)
                                        setHoveredSpecializationId(spec.id)
                                    }}
                                    >
                                        <span>{spec.title}</span>
                                        {hoveredSpecializationId === spec.id && (
                                            <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteSpecialization(spec.id);
                                            }}
                                            className="absolute -top-1 -right-1 p-1 bg-red-400 text-white rounded-full hover:bg-red-600 cursor-pointer"
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                        )}
                                        
                                    </div>
                                ))}
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] items-center gap-2 md:gap-4">
                                <label className="flex text-sm font-bold text-[#234463]">
                                    Keahlian <span className="text-red-500 ml-1">*</span>
                                </label>
                                <input
                                ref={expertiseRef}
                                type="text"
                                value={expertiseInput}
                                onChange={(e) => {setExpertiseInput(e.target.value);
                                    clearError('expertise')
                                }}
                                placeholder="Masukkan keahlian"
                                className={`w-full px-4 py-2 border border-[#234463] rounded-md text-blue-950 focus:outline-none focus:ring-1 focus:border-transparent
                                    ${errors.expertise 
                                        ? 'border-red-500 focus:ring-red-200' 
                                        : 'border-[#234463] focus:ring-1'
                                    }`}
                                />
                                {errors.expertise && (
                                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                        <AlertCircle size={14} />
                                        {errors.expertise}
                                    </p>
                                )}
                            </div>

                            <div className="flex justify-end">
                                <button
                                type="button"
                                onClick={handleAddExpertise}
                                title={editingExpertiseId ? 'Update Keahlian' : '+ Tambah Keahlian'}
                                className="p-2 bg-[#234463] text-white rounded-full hover:bg-blue-950 transition-colors font-medium cursor-pointer"
                                >
                                    {editingExpertiseId ? <Check size={18} /> : <Plus size={18} />}
                                </button>
                            </div>

                            {expertise.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-3">
                                {expertise.map((exp) => (
                                    <div
                                    key={exp.id}
                                    className="text-sm font-medium text-gray-700 relative border border-gray-300 rounded-full px-4 py-2 hover:border-[#234463] hover:bg-blue-50 transition-colors cursor-pointer"
                                    onClick={() => {
                                        handleEditExpertise(exp)
                                        setHoveredExpertiseId(exp.id)}
                                    }
                                    >
                                    <span>{exp.title}</span>
                                    {hoveredExpertiseId === exp.id && (
                                        <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteExpertise(exp.id);
                                        }}
                                        className="absolute -top-1 -right-1 p-1 bg-red-400 text-white rounded-full hover:bg-red-600 cursor-pointer"
                                        >
                                        <Trash2 size={12} />
                                        </button>
                                    )}
                                    </div>
                                ))}
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] items-center gap-2 md:gap-4">
                                <label className="flex text-sm font-bold text-[#234463]">
                                    Pengalaman <span className="text-red-500 ml-1">*</span>
                                </label>
                                <input
                                ref={experienceRef}
                                type="text"
                                value={experienceInput}
                                onChange={(e) => {setExperienceInput(e.target.value);
                                    clearError('experiences')
                                }}
                                placeholder="Masukkan pengalaman khusus"
                                className={`w-full px-4 py-2 border border-[#234463] rounded-md text-blue-950 focus:outline-none focus:ring-1 focus:border-transparent
                                    ${errors.experiences 
                                        ? 'border-red-500 focus:ring-red-200' 
                                        : 'border-[#234463] focus:ring-1'
                                    }`}
                                />
                                {errors.experiences && (
                                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                        <AlertCircle size={14} />
                                        {errors.experiences}
                                    </p>
                                )}
                            </div>

                            <div className="flex justify-end">
                                <button
                                type="button"
                                onClick={handleAddExperience}
                                title={editingExperienceId ? 'Update Pengalaman' : '+ Tambah Pengalaman'}
                                className="p-2 bg-[#234463] text-white rounded-full hover:bg-blue-950 transition-colors font-medium cursor-pointer"
                                >
                                    {editingExperienceId ? <Check size={18} /> : <Plus size={18} />}
                                </button>
                            </div>

                            {experiences.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-3">
                                {experiences.map((exp) => (
                                    <div
                                    key={exp.id}
                                    className="text-sm font-medium text-gray-700 relative border border-gray-300 rounded-full px-4 py-2 hover:border-[#234463] hover:bg-blue-50 transition-colors cursor-pointer"
                                    onClick={() => {handleEditExperience(exp)
                                    setHoveredExperienceId(exp.id)
                                }}
                                    >
                                    <span>{exp.title}</span>
                                    {hoveredExperienceId === exp.id && (
                                        <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteExperience(exp.id);
                                        }}
                                        className="absolute -top-1 -right-1 p-1 bg-red-400 text-white rounded-full hover:bg-red-600 cursor-pointer"
                                        >
                                        <Trash2 size={10} />
                                        </button>
                                    )}
                                    </div>
                                ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/*Schedule*/}
                    <div ref={scheduleRef} className="bg-white md:rounded-lg md:shadow-sm md:p-6">
                        <div className="space-y-4">
                            <div className="rounded-xl bg-[#234463] py-1">
                                <h2 className="text-white font-bold text-center">Jadwal Praktik</h2>
                            </div>

                            {errors.schedules && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
                                    <AlertCircle size={20} className="text-red-500" />
                                    <p className="text-red-600 text-sm font-medium">{errors.schedules}</p>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] items-center gap-2 md:gap-4">
                                <label className="flex text-sm font-bold text-[#234463]">
                                    Atur Tanggal <span className="text-red-500 ml-1">*</span>
                                </label>
                                <CustomCalendar
                                value={scheduleDate}
                                onChange={(date) => setScheduleDate(date)}
                                placeholder="Pilih tanggal"
                                error={errors.schedules}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] items-center gap-2 md:gap-4">
                                <label className="flex text-sm font-semibold text-[#234463]">
                                    Atur Waktu <span className="text-red-500 ml-1">*</span>
                                </label>
                                <div className="grid gap-4">
                                    <div className="grid grid-cols-[50px_1fr] items-center gap-2 min-w-0">
                                        <label className="flex text-sm text-[#234463]">
                                            Jam
                                            <span className="text-red-500 ml-1">*</span>
                                        </label>
                                        <input
                                        type="time"
                                        value={scheduleTime}
                                        onChange={(e) => setScheduleTime(e.target.value)}
                                        className="w-full min-w-0 px-4 py-2 border border-[#234463] rounded-md text-blue-950 focus:outline-none focus:ring-1 focus:border-transparent"
                                        />
                                    </div>

                                    <div className="grid grid-cols-[50px_1fr] items-center gap-2 min-w-0">
                                        <label className="flex text-sm text-[#234463]">
                                            Durasi
                                            <span className="text-red-500 ml-1">*</span>
                                        </label>
                                        <input
                                        type="number"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        value={scheduleDuration}
                                        onChange={(e) => setScheduleDuration(e.target.value)}
                                        placeholder="60"
                                        className="w-full min-w-0 px-4 py-2 border border-[#234463] rounded-md text-blue-950 focus:outline-none focus:ring-1 focus:border-transparent"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <button
                                type="button"
                                onClick={handleAddSchedule}
                                title={editingScheduleId ? 'Update Jadwal' : '+ Tambah Jadwal'}
                                className="p-2 bg-[#234463] text-white rounded-full hover:bg-blue-950 transition-colors font-medium cursor-pointer"
                                >
                                    {editingScheduleId ? <Check size={18} /> : <Plus size={18} />}
                                </button>
                            </div>

                            {/* Schedule List */}
                            {schedules.length > 0 && (
                            <div className="grid gap-3 mt-4">
                                {schedules.map((sch) => (
                                <div key={sch.id} className="space-y-2">
                                    <div
                                    className="relative border border-gray-300 rounded-full px-4 py-2 hover:border-[#234463] hover:bg-blue-50 transition-colors cursor-pointer"
                                    onClick={() => {handleEditSchedule(sch)
                                        setHoveredScheduleId(sch.id)
                                    }}
                                    >
                                        {hoveredScheduleId === sch.id && (
                                            <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteSchedule(sch.id);
                                            }}
                                            className="absolute -top-1 -right-1 p-1 bg-red-400 text-white rounded-full hover:bg-red-600 cursor-pointer"
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                        )}
                                        <div className="text-sm text-gray-600 flex items-center gap-1 sm:gap-2">
                                            <span>{formatDate(sch.date)}</span>
                                            <span>{sch.startTime} ({sch.duration} menit)</span>
                                        </div>
                                    </div>
                                </div>
                                ))}
                            </div>
                            )}
                        </div>
                    </div>

                    {/* Consultation Fee
                    <div className="bg-white md:rounded-lg md:shadow-sm md:p-6">
                        <div className="space-y-4">
                            <div className="rounded-xl bg-[#234463] py-1">
                                <h2 className="text-white text-sm md:text-base font-bold text-center">Biaya Konsultasi</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] items-center gap-2 md:gap-4">
                                <label className="flex text-sm font-bold text-[#234463]">
                                    Biaya Konsultasi / Sesi <span className="text-red-500 ml-1">*</span>
                                </label>
                                <input
                                ref={consultationFeeRef}
                                type="number"
                                value={consultationFee}
                                onChange={(e) => {
                                    setConsultationFee(e.target.value);
                                    clearError('consultationFee');
                                }}
                                placeholder="150.000"
                                className={`w-full px-4 py-2 border border-[#234463] rounded-md text-blue-950 focus:outline-none focus:ring-1 focus:border-transparent
                                    ${errors.consultationFee 
                                        ? 'border-red-500 focus:ring-red-200' 
                                        : 'border-[#234463] focus:ring-1'
                                    }`}
                                />

                                {errors.consultationFee && (
                                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                        <AlertCircle size={14} />
                                        {errors.consultationFee}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div> */}

                    {/*Submit*/}
                    <div className="flex justify-center md:justify-end pb-12">
                        <button
                            type="submit"
                            className="bg-[#1f3b5b] text-white font-bold px-4 py-2 rounded-4xl flex mt-7 hover:bg-blue-900 cursor-pointer"
                        >
                            {initialData ? "Update" : "Simpan"}
                        </button>
                    </div>
                </div>
            </form>

            {showPhotoAction && (
                <div 
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
                    onClick={() => setShowPhotoAction(false)}>
                    <div 
                        className="bg-white rounded-t-3xl sm:rounded-2xl w-full sm:max-w-md shadow-2xl transform transition-all"
                        onClick={(e) => e.stopPropagation()}>
                        <div className="relative p-6 pb-4 border-b border-gray-100">
                            <h3 className="text-lg font-semibold text-[#234463] text-center">
                                Edit Foto Profil
                            </h3>
                            <button
                                type="button"
                                onClick={() => setShowPhotoAction(false)}
                                className="absolute right-4 top-6 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                            >
                                <X size={20} className="text-gray-500" />
                            </button>
                        </div>

                        <div className="p-4 space-y-2">
                            {/* Crop Photo */}
                            <button
                                type="button"
                                onClick={() => {
                                    setShowCropper(true);
                                    setShowPhotoAction(false);
                                }}
                                className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl hover:bg-gray-100 transition-colors group"
                            >
                                <div className="p-2.5 bg-gray-100 rounded-full group-hover:bg-gray-200 transition-colors">
                                    <Crop size={20} className="text-[#234463]" />
                                </div>
                                <div className="text-left">
                                    <p className="font-medium text-[#234463]">Sesuaikan Foto</p>
                                    <p className="text-xs text-gray-500">Crop dan zoom foto profil</p>
                                </div>
                            </button>

                            {/* Change Photo */}
                            <button
                                type="button"
                                onClick={() => {
                                    setShowPhotoAction(false);
                                    fileInputRef.current?.click();
                                }}
                                className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl hover:bg-gray-100 transition-colors group"
                            >
                                <div className="p-2.5 bg-gray-100 rounded-full group-hover:bg-gray-100 transition-colors">
                                    <Upload size={20} className="text-green-700" />
                                </div>
                                <div className="text-left">
                                    <p className="font-medium text-[#234463]">Upload Foto Baru</p>
                                    <p className="text-xs text-gray-500">Pilih foto dari galeri</p>
                                </div>
                            </button>

                            {/* Remove Photo */}
                            <button
                                type="button"
                                onClick={() => {
                                    setPhoto(null);
                                    setShowPhotoAction(false);
                                }}
                                className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl hover:bg-gray-100 transition-colors group"
                            >
                                <div className="p-2.5 bg-gray-100 rounded-full group-hover:bg-gray-100 transition-colors">
                                    <Trash2 size={20} className="text-red-600" />
                                </div>
                                <div className="text-left">
                                    <p className="font-medium text-red-600">Hapus Foto</p>
                                    <p className="text-xs text-gray-500">Kembali ke avatar default</p>
                                </div>
                            </button>
                        </div>

                        <div className="p-4 pt-2 pb-6">
                            <button
                                type="button"
                                onClick={() => setShowPhotoAction(false)}
                                className="w-full py-3 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-colors"
                            >
                                Batal
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showCropper && photo && (
                <div className="fixed inset-0 z-60 bg-black flex flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between px-2 sm:px-12 py-6 bg-black/80 backdrop-blur-sm">
                        <button
                            type="button"
                            onClick={() => setShowCropper(false)}
                            className="flex items-center gap-1 sm:gap-2 text-white hover:text-gray-300 transition-colors"
                        >
                            <X size={24} />
                            <span className="font-medium">Batal</span>
                        </button>
                        
                        <h3 className="text-white font-semibold absolute left-1/2 transform -translate-x-1/2">
                            Sesuaikan Foto
                        </h3>

                        <button
                            type="button"
                            onClick={handleSaveCrop}
                            className="flex items-center gap-1 sm:gap-2 hover:text-gray-300 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                        >
                            <Check size={20} />
                            <span>Simpan</span>
                        </button>
                    </div>

                    {/* Cropper Area */}
                    <div className="flex-1 relative">
                        <Cropper
                            image={photo}
                            crop={crop}
                            zoom={zoom}
                            aspect={1}
                            cropShape="round"
                            showGrid={false}
                            onCropChange={setCrop}
                            onZoomChange={setZoom}
                            onCropComplete={(_, croppedPixels) => {
                                setCroppedAreaPixels(croppedPixels)
                            }}
                        />
                    </div>

                    {/* Zoom Control */}
                    <div className="hidden sm:block px-6 py-6 bg-black/80 backdrop-blur-sm">
                        <div className="max-w-md mx-auto space-y-3">
                            <div className="flex items-center justify-between text-white text-sm">
                                <span className="flex items-center gap-2">
                                    <ImageIcon size={16} />
                                    Zoom
                                </span>
                                <span className="font-medium">{Math.round(zoom * 100)}%</span>
                            </div>
                            <input
                                type="range"
                                min={1}
                                max={3}
                                step={0.1}
                                value={zoom}
                                onChange={(e) => setZoom(Number(e.target.value))}
                                className="w-full h-2 bg-white rounded-lg appearance-none cursor-pointer accent-white"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PsychologistForm;