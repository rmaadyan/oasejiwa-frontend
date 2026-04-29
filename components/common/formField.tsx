'use client'
import React, { ReactNode } from "react";
import {useState} from "react";
import { Eye, EyeOff } from "lucide-react";

type FormFieldProps = {
    label: string;
    id: string;
    name?:string
    type: string;
    autoComplete?: string;
    value: string;
    placeholder?: string;
    onChange: (value : string) => void;
    icon?: ReactNode;
    isPassword?: boolean;
    enableToggle?:boolean;
    options?: string[];
    disabled?: boolean;
    error?: string;                         
    passwordRules?: { label: string; passed: boolean }[];  
    onClearError?: () => void;   
}

export default function FormField({
    label,
    id,
    name,
    type,
    autoComplete,
    value,
    placeholder,
    onChange,
    icon,
    isPassword = false,
    enableToggle = false,
    options,
    disabled,
    error,
    passwordRules,
    onClearError,
}: FormFieldProps){

    const [showPassword, setShowPassword] = useState(false);
    const [showOptions, setShowOptions] = useState(false);

    const inputType =
    isPassword && enableToggle ? showPassword ? "text" : "password" : type;

    const filteredOptions = 
    options?.filter(opt => opt.toLowerCase().includes(value.toLowerCase())) || [];


    return(
        <div className="w-full max-w-xl">
            <label htmlFor={id} className="block text-sm font-bold text-[#234463] mb-1">
                {label}
            </label>
            <div className="relative">
                {icon && (
                    <div className="absolute inset-y-0 inset-left-0 pl-3 flex items-center pointer-events-none text-[#234463]">
                        {icon}
                    </div>
                )}
                {type === "textarea" ? (
                    <textarea
                    id={id}
                    name={name}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    rows={4}
                    className={`appearance-none relative block w-full py-2 border rounded-xl placeholder-gray-350 text-[#234463] focus:outline-none focus:ring-1 focus:border-transparent
                        ${icon ? "pl-10" : "pl-4"} ${enableToggle ? "pr-10" : "pr-4"}`}
                    />
                ):(
                    <input 
                    type= {inputType}
                    id={id}
                    name={name}
                    value={value} 
                    suppressHydrationWarning  
                    onChange={(e) => {
                        onChange(e.target.value);
                        setShowOptions(true);
                        onClearError?.(); 
                    }}
                    onFocus={() => setShowOptions(true)}
                    onBlur={() => setTimeout(() => setShowOptions(false), 150)}
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                    disabled={disabled}
                    className={`appearance-none relative block w-full py-2 border rounded-xl placeholder-gray-350 text-[#234463] focus:outline-none focus:ring-1 focus:border-transparent
                        ${icon ? "pl-10" : "pl-4"} ${enableToggle ? "pr-10" : "pr-4"}
                        ${error ? "border-red-500 focus:ring-red-400" : "border-[#234463]"}`}
                    />
                )}

                {isPassword && enableToggle && (
                    <button
                    type="button"
                    suppressHydrationWarning
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-shadow-[#234463]"
                    >
                        {showPassword? (
                            <EyeOff className="h-5 w-5 cursor-pointer"/>
                        ):(
                            <Eye className="h-5 w-5 cursor-pointer"/>
                        )}
                    </button>
                )}
            </div>
            {showOptions && filteredOptions.length > 0 && (
                <ul className="absolute z-50 bg-white border rounded-xl w-full max-h-48 overflow-auto shadow">
                    {filteredOptions.map(opt => (
                        <li
                            key={opt}
                            onClick={() => {
                                onChange(opt);
                                setShowOptions(false);
                            }}
                            className="px-4 py-2 cursor-pointer hover:bg-blue-50"
                        >
                            {opt}
                        </li>
                    ))}
                </ul>
            )}

            {passwordRules && passwordRules.length > 0 && (
                <div className="mt-2 bg-gray-50 border border-gray-200 rounded-lg p-3 space-y-1">
                    {passwordRules.map((rule, i) => (
                        <p key={i} className={`text-xs flex items-center gap-1.5 ${rule.passed ? "text-green-600" : "text-gray-500"}`}>
                            <span className="inline-block w-4 text-center">{rule.passed ? "✓" : "○"}</span>
                            {rule.label}
                        </p>
                    ))}
                </div>
            )}

            {error && (
                <p className="mt-1.5 text-red-500 text-xs">{error}</p>
            )}
        </div>
    );
}