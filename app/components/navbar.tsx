import { ModeToggle } from "@/components/mode-toggle";

export default function Navbar() {
    return <div className="h-18 w-screen border-b-2 border-white/10">
        <div className="container mx-auto h-full flex items-center justify-between">
            <h1 className="text-3xl font-bold">
                Splitwise
            </h1>
            <ModeToggle />
        </div>
    </div>
}