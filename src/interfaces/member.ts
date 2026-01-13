import type { Member } from "../zod"
import type { MemberWithHashedPassword } from "../zod"
import type { CreateMemberInput } from "../zod"

export interface MemberRepository {
    create(data: CreateMemberInput): Promise<MemberWithHashedPassword>
    findByEmail(email: string): Promise<MemberWithHashedPassword | null>
    findManyByEmail(emails: string[]): Promise<Member[]>
    findById(id: string): Promise<Member | null>
    findFromKeyword(keyword: string): Promise<Member[] | null>
}
