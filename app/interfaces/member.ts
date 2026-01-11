import type { Member } from "../zod"
import type { MemberWithHashedPassword } from "../zod"
import type { CreateMemberInput } from "../zod"

export interface MemberRepository {
    create(data: CreateMemberInput): Promise<MemberWithHashedPassword>
    findByEmail(email: string): Promise<MemberWithHashedPassword | null>
    findById(id: string): Promise<Member | null>
}
