import { ReactNode } from "react"

const layout = ({ children }: { children: ReactNode }) => {
    return (
        <div className="relative flex flex-col items-center justify-center w-full h-screen">{children}</div>
    )
}
export default layout