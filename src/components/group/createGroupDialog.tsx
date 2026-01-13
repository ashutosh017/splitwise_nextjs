'use client';

import { useActionState, useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, X } from "lucide-react";
import { createGroup, findMatchingUsers } from "@/app/actions/group";
import { Member } from "@/zod";

export function CreateGroupDialog() {
    const [members, setMembers] = useState<string[]>([]);
    const [open, setOpen] = useState(false);
    const [emailInput, setEmailInput] = useState("");
    const [suggestions, setSuggestions] = useState<Member[]>([]);

    const addMember = (email: string) => {
        if (email && !members.includes(email)) {
            setMembers([...members, email]);
        }
    };

    const removeMember = (email: string) => {
        setMembers(members.filter((m) => m !== email));
    };
    const [state, formAction, isPending] = useActionState(createGroup, null);
    const inputRef = useRef<HTMLInputElement | null>(null)

    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (emailInput.length >= 3) {
                const results = await findMatchingUsers(emailInput);
                if (results.data) setSuggestions(results.data);
            } else {
                setSuggestions([]);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [emailInput]);
    const selectUser = (email: string) => {
        if (!members.includes(email)) {
            setMembers([...members, email]);
        }
        setEmailInput("");
        setSuggestions([]);
    };
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <Plus className="mr-2 h-4 w-4" /> Create Group
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425]">
                <DialogHeader>
                    <DialogTitle>Create a new group</DialogTitle>
                </DialogHeader>

                <form action={formAction} className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Group Name</label>
                        <Input name="name" placeholder="e.g. Trip to Goa" required />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Description</label>
                        <Textarea name="description" placeholder="What is this group for?" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Add Members (Optional)</label>
                        <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                ref={inputRef}
                                value={emailInput}
                                onChange={(e) => setEmailInput(e.target.value)}
                                placeholder="Enter email address"
                                name="members"
                                className="pl-8"
                            />
                            {emailInput && (
                                <X
                                    onClick={() => { setEmailInput(""); setSuggestions([]); }}
                                    className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground cursor-pointer"
                                />
                            )}
                            {suggestions.length > 0 && (
                                <ul className="absolute z-50 w-full bg-popover border border-white/10 rounded-md mt-1 shadow-xl overflow-hidden">
                                    {suggestions.map((user) => (
                                        <li
                                            key={user.email}
                                            onClick={() => selectUser(user.email)}
                                            className="p-2 hover:bg-accent cursor-pointer flex flex-col text-sm border-b border-white/5 last:border-0"
                                        >
                                            <span className="font-medium">{user.name}</span>
                                            <span className="text-xs text-muted-foreground">{user.email}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* List of added members */}
                        <div className="flex flex-wrap gap-2 pt-2">
                            {members.map(email => (
                                <div key={email} className="flex items-center gap-1 bg-secondary px-2 py-1 rounded-md text-xs">
                                    {email}
                                    <X className="h-3 w-3 cursor-pointer" onClick={() => removeMember(email)} />
                                </div>
                            ))}
                        </div>
                    </div>

                    <Button type="submit" className="w-full">Create Group</Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}