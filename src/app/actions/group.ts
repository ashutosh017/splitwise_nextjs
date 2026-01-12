'use server'
import { groupService, memberService } from "@/di/container";
import { ActionResponse, catchErrors } from "@/lib/action-wrapper";
import { GroupSummary, Member } from "@/zod";

export async function createGroup(initialState: any, formData: FormData): Promise<ActionResponse<GroupSummary>> {
    return catchErrors(async () => {
        const name = formData.get('name') as string;
        const description = formData.get("description") as string
        const groupSummary = await groupService.createGroup({
            name, description
        })
        return groupSummary
    })
}

export async function findMatchingUsers(keyword: string): Promise<ActionResponse<Member[] | null>> {
    return catchErrors(async () => {
        const users = await memberService.findFromKeyword(keyword)
        return users
    })
}