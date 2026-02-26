import React from "react";
import { AlertCircle, CheckCircle, Info, XCircle } from "lucide-react";

interface AlertProps {
    variant?: "default" | "destructive" | "success" | "warning" | "info";
    className?: string;
    children: React.ReactNode;
}

interface AlertTitleProps {
    className?: string;
    children: React.ReactNode;
}

interface AlertDescriptionProps {
    className?: string;
    children: React.ReactNode;
}

export function Alert({ variant = "default", className = "", children }: AlertProps) {
    const styles = {
        default: "bg-gray-50 border-gray-200 text-gray-800",
        destructive: "bg-red-50 border-red-200 text-red-800",
        success: "bg-green-50 border-green-200 text-green-800",
        warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
        info: "bg-blue-50 border-blue-200 text-blue-800",
    };

    const icons = {
        default: <Info className="h-4 w-4" />,
        destructive: <XCircle className="h-4 w-4" />,
        success: <CheckCircle className="h-4 w-4" />,
        warning: <AlertCircle className="h-4 w-4" />,
        info: <Info className="h-4 w-4" />,
    };

    return (
        <div
            role="alert"
            className={`relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground ${styles[variant]} ${className}`}
        >
            {icons[variant]}
            {children}
        </div>
    );
}

export function AlertTitle({ className = "", children }: AlertTitleProps) {
    return (
        <h5 className={`mb-1 font-medium leading-none tracking-tight ${className}`}>
            {children}
        </h5>
    );
}

export function AlertDescription({ className = "", children }: AlertDescriptionProps) {
    return (
        <div className={`text-sm [&_p]:leading-relaxed ${className}`}>{children}</div>
    );
}
