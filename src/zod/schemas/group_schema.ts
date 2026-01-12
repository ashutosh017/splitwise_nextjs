import z from 'zod'

export const CreateGroupSchema = z.object({
    name: z.string().min(1).max(100),
    description: z.string().min(1).max(400)
})

export const AddOrRemoveMemberSchema = z.object({
    groupId: z.string().min(1).max(100),
    memberId: z.string().min(1).max(100)
})

export const deleteGroupSchema = z.object({
    id: z.uuid()
})

export const GroupSummarySchema = z.object({
    id: z.uuid(),
    name: z.string().min(1).max(100),
    description: z.string().min(1).max(1000)
})
export const GroupIdInputSchema = z.object({
    groupId: z.uuid()
})

export type GroupIdInput = z.infer<typeof GroupIdInputSchema>
export type CreateGroupInput = z.infer<typeof CreateGroupSchema>
export type GroupSummary = z.infer<typeof GroupSummarySchema>
export type AddOrRemoveMemberInput = z.infer<typeof AddOrRemoveMemberSchema>
export type DeleteGroupInput = z.infer<typeof deleteGroupSchema>