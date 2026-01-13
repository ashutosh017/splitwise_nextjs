import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function MemberList({ members }: { members: any[] }) {
    return (
        <div className="space-y-4">
            {members.map((gm) => (
                <div key={gm.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                            <AvatarFallback>
                                {/* {gm.member?.name?.charAt(0) || gm.email.charAt(0).toUpperCase()} */}
                                A
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-sm font-medium leading-none">
                                {gm.member?.name || "Invited User"}
                            </p>
                            <p className="text-xs text-muted-foreground">{gm.email}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}