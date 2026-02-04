'use client'
import React from "react";

type ModalProps = {
    open: boolean;
    title?: string;
    message: string;
    onClose: () => void;
};

export default function ResetPassModal({
    open,
    title = "Info",
    message,
    onClose,
}: ModalProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
            className="absolute inset-0 bg-black/50"
            onClick={onClose}
        />

        <div className="relative bg-white rounded-2xl shadow-2xl w-[90%] max-w-md p-6 animate-fadeIn">
            <h2 className="text-xl font-bold text-blue-950 mb-2">
            {title}
            </h2>

            <p className="text-gray-700 mb-6">
            {message}
            </p>

            <div className="flex justify-end">
            <button
                onClick={onClose}
                className="px-6 py-2 bg-blue-900 text-white rounded-xl hover:bg-blue-800 cursor-pointer"
            >
                OK
            </button>
            </div>
        </div>
        </div>
    );
}
