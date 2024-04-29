import Logo from "@/components/Logo";
import { Metadata } from "next";
import React from "react";


export const metadata: Metadata = {
    title: "Authentication",
    description: ""
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative flex flex-col items-center justify-center h-screen w-full">
            <Logo />
            <div className="mt-12">
                {children}
            </div>
        </div>
    )
}