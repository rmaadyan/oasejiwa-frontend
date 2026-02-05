'use client'

import React from "react";

type InforProps = {
    label: string;
    value: string;
    icon?: React.ReactNode;
};

export default function ProfileInformation({
    label,
    value,
    icon,
}: InforProps){
    return(
        <div className="flex flex-col md:flex-row items-start md:items-center gap-3 text-sm">
            <label className="w-40 shrink-0 font-medium text-gray-500 ">{label}</label>
            <div className="flex gap-4 items-start">
                {icon && <span className="text-blue-950 mt-0.5">{icon}</span>}
                <p className="text-blue-950 font-medium">{value}</p>
            </div>
        </div>
    )
}