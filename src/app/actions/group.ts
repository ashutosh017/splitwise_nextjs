'use server'
import { balanceService, groupService, memberService } from "@/di/container";
import { ActionResponse, catchErrors } from "@/lib/action-wrapper";
import { GroupSummary, GroupWithMembers, Member } from "@/zod";
import { getCurrentUser } from "./auth";
import { redirect } from "next/navigation";

export async function settleDebtAction(groupId: string, fromId: string, toId: string, amt: string) {

}

export async function addMember(groupId: string, uesrId: string): Promise<ActionResponse<void>> {
    return catchErrors(async () => {
        return groupService.addMember(groupId, uesrId)
    })
}

export async function createGroup(initialState: any, formData: FormData): Promise<ActionResponse<GroupSummary>> {
    return catchErrors(async () => {
        const currentUser = await getCurrentUser();
        if (!currentUser) redirect('/');

        const name = formData.get('name') as string;
        const description = formData.get("description") as string;
        const rawMembers = formData.get("members") as string;

        const memberObjects = JSON.parse(rawMembers || "[]") as { email: string }[];
        let emails = memberObjects.map(m => m.email);

        if (!emails.includes(currentUser.email)) {
            emails.push(currentUser.email);
        }

        const membersWithIds = await memberService.findManyByEmail(emails);

        if (membersWithIds.length !== emails.length) {
            throw new Error("One or more invited users do not have an account.");
        }

        const groupSummary = await groupService.createGroupWithMembers({
            name,
            description,
            memberIds: membersWithIds.map((m) => m.id)
        });

        // revalidatePath('/dashboard');
        console.log("control reached here: ", groupSummary)

        return groupSummary;
    });
}

export async function getGroupDetail(groupId: string): Promise<ActionResponse<any | null>> {
    return catchErrors(async () => {
        const group = await groupService.getGroupDetails(groupId)
        return JSON.parse(JSON.stringify(group))
    })
}

export async function findGroups(memberId: string): Promise<ActionResponse<GroupWithMembers[] | null>> {
    return catchErrors(async () => {
        const groups = await groupService.listGroupsForMember(memberId)
        console.log("grousp: ", groups)
        return groups
    }
    )
}
export async function getTotalBalanceInAGroup(userId: string, groupId: string): Promise<ActionResponse<number>> {
    return catchErrors(async () => {
        return balanceService.getTotalBalance(userId, groupId);
    })
}
