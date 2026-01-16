'use client';

import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus, Search, X, Loader2 } from "lucide-react";
import { searchUsers } from "@/app/actions/members";
import { Member } from "@/zod";
import { addMember } from "@/app/actions/group";

export function AddMemberDialog({ groupId }: { groupId: string }) {
    const [open, setOpen] = useState(false);
    const [emailInput, setEmailInput] = useState("");
    const [suggestions, setSuggestions] = useState<Member[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    // Search Logic with Debounce
    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (emailInput.length >= 3) {
                setIsSearching(true);
                const results = await searchUsers(emailInput);
                setSuggestions(results.data ?? []);
                setIsSearching(false);
            } else {
                setSuggestions([]);
            }
        }, 300);
        return () => clearTimeout(delayDebounceFn);
    }, [emailInput]);

    const handleAdd = async (userId: string) => {
        const result = await addMember(groupId, userId);
        if (result.success) {
            setOpen(false);
            setEmailInput("");
        } else {
            alert(result.error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size={"default"}>
                    <UserPlus className="mr-2 h-4 w-4" /> Add Member
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425]">
                <DialogHeader>
                    <DialogTitle>Invite to Group</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 pt-4 relative">
                    <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by email..."
                            className="pl-8"
                            value={emailInput}
                            onChange={(e) => setEmailInput(e.target.value)}
                        />
                        {isSearching && <Loader2 className="absolute right-2 top-2.5 h-4 w-4 animate-spin text-muted-foreground" />}
                    </div>

                    {/* Suggestions Dropdown */}
                    {suggestions.length > 0 && (
                        <ul className="absolute z-50 w-full bg-popover border border-white/10 rounded-md mt-1 shadow-xl">
                            {suggestions.map((user) => (
                                <li
                                    key={user.email}
                                    onClick={() => handleAdd(user.id)}
                                    className="p-3 hover:bg-accent cursor-pointer border-b border-white/5 last:border-0 flex justify-between items-center"
                                >
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium">{user.name}</span>
                                        <span className="text-xs text-muted-foreground">{user.email}</span>
                                    </div>
                                    <UserPlus className="h-4 w-4 text-primary" />
                                </li>
                            ))}
                        </ul>
                    )}

                    <p className="text-xs text-muted-foreground text-center">
                        Only registered users can be added to the group.
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
}