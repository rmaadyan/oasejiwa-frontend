"use client";

import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { X, Check } from "lucide-react";

interface AvatarCropperModalProps {
  imageSrc: string;
  isOpen: boolean;
  onClose: () => void;
  onCropCompleteAction: (croppedBlob: Blob) => void;
}

export default function AvatarCropperModal({
  imageSrc,
  isOpen,
  onClose,
  onCropCompleteAction,
}: AvatarCropperModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const onCropChange = (newCrop: { x: number; y: number }) => {
    setCrop(newCrop);
  };

  const onCropAreaChange = useCallback((_: any, areaPixels: any) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  const createCroppedImage = async () => {
    try {
      const image = new Image();
      image.src = imageSrc;
      await new Promise((resolve) => (image.onload = resolve));

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx || !croppedAreaPixels) return;

      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;

      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );

      canvas.toBlob(
        (blob) => {
          if (blob) {
            onCropCompleteAction(blob);
            onClose();
          }
        },
        "image/jpeg",
        0.85 // Kompresi agar upload instan
      );
    } catch (e) {
      console.error("Gagal crop gambar:", e);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex flex-col items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-slate-900 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[480px]">
        {/* Header */}
        <div className="flex justify-between items-center px-5 py-4 border-b border-slate-800 text-white z-10">
          <span className="text-sm font-semibold">Sesuaikan Foto Profil</span>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-800 text-slate-400"
          >
            <X size={20} />
          </button>
        </div>

        {/* Area Crop Lingkaran (WhatsApp Style) */}
        <div className="relative flex-1 w-full bg-black">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={onCropChange}
            onZoomChange={setZoom}
            onCropComplete={onCropAreaChange}
          />
        </div>

        {/* Kontrol Zoom & Simpan */}
        <div className="p-5 bg-slate-900 flex flex-col gap-4 z-10">
          <input
            type="range"
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            aria-label="Zoom"
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full accent-[#2B5379] h-1.5 bg-slate-700 rounded-lg cursor-pointer"
          />

          <div className="flex justify-between items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-700 text-slate-300 text-xs font-semibold hover:bg-slate-800"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={createCroppedImage}
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-[#2B5379] hover:bg-[#396894] text-white text-xs font-semibold shadow-md"
            >
              <Check size={16} />
              <span>Gunakan Foto</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}