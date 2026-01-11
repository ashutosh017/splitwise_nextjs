import type { Query } from 'pg'
import z from 'zod'
import { ExpenseSummarySchema } from './expense_schema'
import { SplitSumarySchema } from './split_schema'

export const CreateBalanceInputSchema = z.object({
    amount: z.number(),
    groupId: z.uuid(),
    fromMemberId: z.uuid(),
    toMemberId: z.uuid()
})
export const BalanceSummarySchema = z.object({
    amount: z.number(),
    groupId: z.uuid(),
    fromMemberId: z.uuid(),
    toMemberId: z.uuid()
})
export const QueryBalanceInputSchema = BalanceSummarySchema.omit({
    amount: true
})
export const ApplyExpenseInputSchema = z.object({
    expenses: ExpenseSummarySchema,
    normalizedSplits: z.map(z.string(), z.number())
})
export const ReverseExpenseInputSchema = z.object({
    expenses: ExpenseSummarySchema,
    splits: z.array(SplitSumarySchema)
})

export type ReverseExpenseInput = z.infer<typeof ReverseExpenseInputSchema>
export type ApplyExpenseInput = z.infer<typeof ApplyExpenseInputSchema>
export type QueryBalanceInput = z.infer<typeof QueryBalanceInputSchema>
export type CreateBalanceInput = z.infer<typeof CreateBalanceInputSchema>
export type BalanceSummary = z.infer<typeof BalanceSummarySchema>

