import type { CreateGroupInput, GroupSummary, Member } from "../zod";

export interface GroupRepository {
    create(data: CreateGroupInput): Promise<GroupSummary>
    findById(groupId: string): Promise<GroupSummary | null>
    hasMember(groupId: string, memberId: string): Promise<boolean>
    addMember(groupId: string, memberId: string): Promise<void>
    removeMember(groupId: string, memberId: string): Promise<void>
    listGroups(): Promise<GroupSummary[]>
    listMembers(groupId: string): Promise<Member[]>
    listGroupsForMember(memberId: string): Promise<GroupSummary[]>
    delete(groupId: string): Promise<void>
}