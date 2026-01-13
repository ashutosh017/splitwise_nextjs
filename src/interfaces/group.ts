import type { CreateGroupInput, CreateGroupWithMembersInput, GroupSummary, GroupWithMembers, Member } from "../zod";

export interface GroupRepository {
    create(data: CreateGroupInput): Promise<GroupSummary>
    createGroupWithMembers(input: CreateGroupWithMembersInput): Promise<GroupSummary>
    findById(groupId: string): Promise<GroupSummary | null>
    hasMember(groupId: string, memberId: string): Promise<boolean>
    addMember(groupId: string, memberId: string): Promise<void>
    addMembers(data: { groupId: string, memberId: string }[]): Promise<void>
    removeMember(groupId: string, memberId: string): Promise<void>
    listGroups(): Promise<GroupSummary[]>
    listMembers(groupId: string): Promise<Member[]>
    listGroupsForMember(memberId: string): Promise<GroupWithMembers[]>
    delete(groupId: string): Promise<void>
}