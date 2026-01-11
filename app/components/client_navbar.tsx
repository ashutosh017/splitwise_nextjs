'use client';

import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"; // Assuming Shadcn UI
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";

export default function ClientNavbar({ isLoggedIn, name }: { isLoggedIn: boolean, name: string | null }) {

    // Get initials for the avatar fallback (e.g., "John Doe" -> "JD")
    const initials = name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : "U";

    return (
        <nav className="h-16 w-full border-b border-white/10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto h-full flex items-center justify-between px-4">
                <Link href="/" className="hover:opacity-80 transition-opacity">
                    <h1 className="text-2xl font-bold tracking-tight">
                        Splitwise
                    </h1>
                </Link>

                <div className="flex items-center space-x-6">
                    {isLoggedIn ? (
                        <div className="flex items-center gap-4">
                            {/* User Menu */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                                        <Avatar className="h-10 w-10 border border-white/10">
                                            <AvatarFallback className="bg-primary/10 text-primary">
                                                {initials}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56 mt-2">
                                    <div className="flex items-center justify-start gap-2 p-2">
                                        <div className="flex flex-col space-y-1 leading-none">
                                            <p className="font-medium">{name}</p>
                                        </div>
                                    </div>
                                    <DropdownMenuItem asChild>
                                        <Link href="/dashboard">Dashboard</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/settings">Settings</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        className="text-destructive focus:bg-destructive/10"
                                    // onClick={() => Signout()}
                                    >
                                        Log out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    ) : (
                        <Link href="/signin">
                            <Button variant="default" size="sm">Log in</Button>
                        </Link>
                    )}
                    <ModeToggle />
                </div>
            </div>
        </nav>
    );
}