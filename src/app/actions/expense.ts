'use server'

import { expenseService } from "@/di/container"
import { ActionResponse, catchErrors } from "@/lib/action-wrapper"
import { ExpenseSummary, SplitSummary, SplitType } from "@/zod";

export async function CreateExpense(initialState: any, formData: FormData): Promise<ActionResponse<ExpenseSummary>> {
    return catchErrors(async () => {
        const description = formData.get("description") as string;
        const splitType = formData.get("splitType") as SplitType
        const amount = formData.get("amount") as unknown as number;
        const whoPaidId = formData.get("whoPaidId") as string;
        const groupId = formData.get("groupId") as string;
        const rawSplits = formData.get("splits") as string;
        const splits = JSON.parse(rawSplits || "[]") as { memberId: string, value: number }[];
        const expenseSummary = await expenseService.create({
            description: description,
            splitType: splitType,
            amount,
            whoPaidId,
            groupId,
            splits,
        })
        return expenseSummary
    })

}