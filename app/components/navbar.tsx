import { ModeToggle } from "@/components/mode-toggle";
import Link from "next/link";
import { useContext } from "react";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";

export default function Navbar() {
    const { user, isLoading } = useAuth()
    return <div className="h-18 w-screen border-b-2 border-white/10">
        <div className="container mx-auto h-full flex items-center justify-between">
            <Link href={'/'}>
                <h1 className="text-3xl font-bold">
                    Splitwise
                </h1>
            </Link>
            <div className=" flex space-x-4">
                <Button>{
                    user ? user.email : 'Login'
                }</Button>
                <ModeToggle />

            </div>
        </div>
    </div>
}