import Navbar from "@/components/Navbar"
import { Metadata } from "next"
import { ReactNode } from "react"
export const metadata: Metadata = {
    title: "User Interface"
}
const DashboardLayout = ({ children }: { children: ReactNode }) => {
    return (
        <div className="relative h-screen w-full flex flex-col">
            <Navbar />
            <div className="w-full">
                {children}
            </div>
        </div>
    )
}
export default DashboardLayout