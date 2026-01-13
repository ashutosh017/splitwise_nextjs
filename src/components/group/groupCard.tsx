// src/components/dashboard/GroupCard.tsx
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { GroupWithMembers } from "@/zod";
import { Users } from "lucide-react";
import Link from "next/link";

export function GroupCard({ group }: { group: GroupWithMembers }) {
    return (
        <Link href={`/dashboard/groups/${group.id}`}>
            <Card className="hover:bg-white/5 transition-colors cursor-pointer border-white/10 bg-card">
                <CardHeader className="flex flex-row items-center space-x-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                        <CardTitle className="text-lg">{group.name}</CardTitle>
                        <CardDescription className="line-clamp-1">
                            {group.description || "No description"}
                        </CardDescription>
                    </div>
                    <div className="text-xs text-muted-foreground">
                        {group.members.length} members
                    </div>
                </CardHeader>
            </Card>
        </Link>
    );
}