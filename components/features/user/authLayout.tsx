import React, { ReactNode } from "react";

type SignProps = {
    title: string;
    description: string;
    children?: ReactNode;
}

export default function AuthLayout({ title, description, children }: SignProps){
    return(
        <div className="min-h-screen w-full flex items-center justify-center">
            <div className="min-h-screen w-full flex">
                <div className="hidden lg:flex flex-col w-full justify-center items-center px-6 md:px-16 text-white bg-[url('/bghero/gambar.jpg')] bg-cover bg-center">
                    <h1 className="text-5xl md:text-6xl font-bold leading-tight">Oase Jiwa</h1>
                    <p className="mt-4 text-lg md:text-xl text-white">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                </div>

                <div className="min-h-screen w-full flex flex-col justify-center bg-white px-2 md:px-14">
                    <div className={`mb-8 ${description === "Create new account" ? "pt-12" : "pt-0"}`}>
                        <h1 className={`text-center font-bold leading-tight text-blue-950 ${title === "Reset Password" ? "text-2xl md:text-3xl" : "text-5xl md:text-6xl"}`}>{title}</h1>
                        <p className=" text-lg md:text-xl text-blue-950 text-center">{description}</p>
                    </div>
                    <div className="px-8 md:px-14 pb-12">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}