'use client'
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Member } from "@/zod";

export function MemberList({ members }: { members: { member: Member }[] }) {
    if (!members) return;
    return (

        <div className="space-y-4">
            {members && members.map((gm) => (
                <div key={gm.member.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                            <AvatarFallback>
                                {gm.member.name && gm.member.name.charAt(0) || gm.member.email && gm.member.email.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-sm font-medium leading-none">
                                {gm.member.name || "Invited User"}
                            </p>
                            <p className="text-xs text-muted-foreground">{gm.member.email}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}