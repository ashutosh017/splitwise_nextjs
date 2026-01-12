import z, { type TypeOf } from "zod";

export const MemberSchema = z.object({
    id: z.uuid(),
    name: z.string().min(1).max(100),
    email: z.email(),
})

export const MemberWithHashedPasswordSchema = MemberSchema.extend({
    password: z.string().min(4).max(100)
})

export const CreateMemberInputSchema = MemberWithHashedPasswordSchema.omit({
    id: true
})
export const MemberIdInputSchema = z.object({
    memberId: z.uuid()
})
export const EmailInputSchema = z.object({
    email: z.email()
})
export const QueryMemberInputSchema = z.object({
    memberId: z.uuid(),
    groupId: z.uuid()
})

export type QueryMemberInput = z.infer<typeof QueryMemberInputSchema>
export type EmailInput = z.infer<typeof EmailInputSchema>
export type MemberIdInput = z.infer<typeof MemberIdInputSchema>
export type Member = z.infer<typeof MemberSchema>
export type MemberWithHashedPassword = z.infer<typeof MemberWithHashedPasswordSchema>
export type CreateMemberInput = z.infer<typeof CreateMemberInputSchema>


