import z from 'zod'
import { MemberSchema } from './member_schema'

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

export const CreateGroupWithMembersInputSchema = CreateGroupSchema.extend({
    memberIds: z.array(z.uuid())
})
export const GroupWithMembersSchema = GroupSummarySchema.extend({
    members: z.array(z.object({
        id: z.uuid()
    }))
})

export type GroupWithMembers = z.infer<typeof GroupWithMembersSchema>
export type GroupIdInput = z.infer<typeof GroupIdInputSchema>
export type CreateGroupInput = z.infer<typeof CreateGroupSchema>
export type CreateGroupWithMembersInput = z.infer<typeof CreateGroupWithMembersInputSchema>
export type GroupSummary = z.infer<typeof GroupSummarySchema>
export type AddOrRemoveMemberInput = z.infer<typeof AddOrRemoveMemberSchema>
export type DeleteGroupInput = z.infer<typeof deleteGroupSchema>