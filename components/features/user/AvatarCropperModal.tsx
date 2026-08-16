"use client";

import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { X, Check, ZoomIn, ZoomOut } from "lucide-react";

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
      image.crossOrigin = "anonymous"; // 👈 WAJIB ADA
      image.src = imageSrc;

      await new Promise((resolve, reject) => {
        image.onload = resolve;
        image.onerror = (e) => reject(e);
      });

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx || !croppedAreaPixels) return;

      const targetSize = 400;
      canvas.width = targetSize;
      canvas.height = targetSize;

      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        targetSize,
        targetSize
      );

      canvas.toBlob(
        (blob) => {
          if (blob) {
            onCropCompleteAction(blob);
            onClose();
          }
        },
        "image/jpeg",
        0.85
      );
    } catch (e) {
      console.error("Gagal crop dan kompres gambar:", e);
    }
  };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex flex-col items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-slate-900 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[490px] border border-slate-700">
        
        {/* Header */}
        <div className="flex justify-between items-center px-5 py-4 border-b border-slate-800 text-white z-10">
          <span className="text-sm font-semibold">Sesuaikan Foto Profil</span>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-800 text-slate-400 cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Area Crop: Persegi Serasi dengan Card Profil */}
        <div className="relative flex-1 w-full bg-black">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="rect"
            showGrid={true}
            onCropChange={onCropChange}
            onZoomChange={setZoom}
            onCropComplete={onCropAreaChange}
          />
        </div>

        {/* Zoom & Action Buttons */}
        <div className="p-5 bg-slate-900 flex flex-col gap-3.5 z-10">
          <div className="flex items-center gap-3">
            <ZoomOut size={16} className="text-slate-400" />
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.05}
              aria-label="Zoom"
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full accent-[#3B82F6] h-1.5 bg-slate-700 rounded-lg cursor-pointer"
            />
            <ZoomIn size={16} className="text-slate-400" />
          </div>

          <div className="flex justify-between items-center gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 py-2.5 rounded-xl border border-slate-700 text-slate-300 text-xs font-semibold hover:bg-slate-800 transition cursor-pointer"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={createCroppedImage}
              className="w-1/2 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#234463] hover:bg-[#2B5379] text-white text-xs font-semibold shadow-md transition cursor-pointer"
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