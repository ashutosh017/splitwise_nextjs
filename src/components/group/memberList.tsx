"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Trash2 } from "lucide-react";
import { Member } from "@/zod";
import { removeMember } from "@/app/actions/group";
import { DetailedGroupData } from "@/interfaces";
import { useTransition } from "react";

export function MemberList({ group }: { group: DetailedGroupData }) {
  if (!group) return null;
  const [isPending, startTransition] = useTransition();

  return (
    <div className="space-y-2">
      {group.members.map((gm) => (
        <div
          key={gm.member.id}
          className="group flex items-center justify-between rounded-md px-2 py-1 hover:bg-muted transition"
        >
          {/* Left */}
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback>
                {(gm.member.name ?? gm.member.email)?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div>
              <p className="text-sm font-medium leading-none">
                {gm.member.name || "Invited User"}
              </p>
              <p className="text-xs text-muted-foreground">{gm.member.email}</p>
            </div>
          </div>

          {/* Right – Confirm delete */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button
                className="opacity-0 group-hover:opacity-100 transition text-muted-foreground hover:text-destructive"
                aria-label="Remove member"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Remove member?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently remove{" "}
                  <span className="font-medium">
                    {gm.member.name || gm.member.email}
                  </span>{" "}
                  from the group.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={() => {
                    startTransition(async () => {
                      await removeMember(group.id, gm.member.id);
                    });
                  }}
                >
                  {isPending ? "Removing..." : "Remove"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ))}
    </div>
  );
}
