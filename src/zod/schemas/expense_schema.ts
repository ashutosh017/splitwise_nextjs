import z from 'zod'
import { SplitSumarySchema, SplitTypeSchema } from './split_schema'
export const UpdateExpenseInputSchema = z.object({
    whoPaidId: z.uuid().optional(),
    description: z.string().min(1).max(400).optional(),
    amount: z.number().optional(),
    expenseId: z.uuid(),
    splitType: SplitTypeSchema.optional(),
})

export const ExpenseSummarySchema = z.object({
    id: z.uuid(),
    whoPaidId: z.uuid(),
    description: z.string().min(1).max(400).nullable(),
    amount: z.number(),
    groupId: z.uuid(),
    splitType: SplitTypeSchema
})

export const CreateExpenseRepoInputSchema = z.object({
    splitType: SplitTypeSchema,
    description: z.string().min(1).max(400).nullable(),
    amount: z.number(),
    whoPaidId: z.uuid(),
    groupId: z.uuid()
})

export const CreateExpenseInputSchema = CreateExpenseRepoInputSchema.extend({
    splits: SplitSumarySchema
        .array().min(1)
})

export const ExpenseIdInputSchema = z.object({
    expenseId: z.uuid()
})

export type ExpenseIdInput = z.infer<typeof ExpenseIdInputSchema>
export type UpdateExpenseInput = z.infer<typeof UpdateExpenseInputSchema>
export type ExpenseSummary = z.infer<typeof ExpenseSummarySchema>
export type CreateExpenseRepoInput = z.infer<typeof CreateExpenseRepoInputSchema>
export type CreateExpenseInput = z.infer<typeof CreateExpenseInputSchema>