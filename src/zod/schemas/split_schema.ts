import z from 'zod'

export const CreateManySplitSchema = z.object({
    expenseId: z.uuid(),
    normalizedSplits: z.map(z.string(), z.number())
})

export const SplitSumarySchema = z.object({
    value: z.number(),
    memberId: z.uuid()
})

export const SplitTypeSchema = z.enum([
    'AMOUNT', 'SHARE', 'PERCENTAGE', 'EQUAL'
])

export type CreateManySplitInput = z.infer<typeof CreateManySplitSchema>
export type SplitSummary = z.infer<typeof SplitSumarySchema>
export type SplitType = z.infer<typeof SplitTypeSchema>