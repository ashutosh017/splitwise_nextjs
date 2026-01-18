import { notFound, redirect } from "next/navigation";
import { Users, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getCurrentUser } from "@/app/actions/auth";
import { ExpenseList } from "@/components/group/exepenseList";
import { MemberList } from "@/components/group/memberList";
import {
  getGroupDetail,
  getTotalBalanceOfAUserInAGroup,
} from "@/app/actions/group";
import { AddExpenseDialog } from "@/components/group/addExpenseDialog";
import { AddMemberDialog } from "@/components/group/addMemberDialog";
import { SettleGroupDialog } from "@/components/group/settleGroupDialog";
import { getNetBalancesOfAllUsersInAGroup } from "@/app/actions/balance";

export default async function GroupPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) redirect("/signin");

  let group = await getGroupDetail(id);
  if (group.error) {
    return;
  }

  if (!group || !group.data) notFound();

  const totalBalance = (
    await getTotalBalanceOfAUserInAGroup(user.id, group.data.id)
  ).data;
  const netBalances = (await getNetBalancesOfAllUsersInAGroup(group.data.id))
    .data;
  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 pt-4 px-3">
      {/* Navigation & Header */}
      <div className="flex flex-col gap-4">
        <Link
          href="/dashboard"
          className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Link>

        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">
              {group.data.name}
            </h1>
            <p className="text-muted-foreground mt-1">
              {group.data.description}
            </p>
          </div>
          <div className="gap-2 grid grid-cols-1 md:grid-cols-3 ">
            <SettleGroupDialog
              group={group.data}
              netBalances={netBalances ?? {}}
            />
            <AddMemberDialog groupId={group.data.id} />
            <AddExpenseDialog group={group.data} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content: Expense History */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Recent Expenses</h2>
          </div>
          <ExpenseList expenses={group.data.expenses} />
        </div>

        {/* Sidebar: Members & Balances */}
        <div className="space-y-6">
          <div className="rounded-xl border border-white/10 bg-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-5 w-5 text-primary" />
              <h2 className="font-semibold text-lg">Group Members</h2>
            </div>
            <MemberList members={group.data.members} />
          </div>

          {/* Quick Stats Card */}
          <div className="rounded-xl bg-primary/5 border border-primary/20 p-6">
            <h3 className="text-sm font-medium text-primary mb-1">
              Your total balance here
            </h3>
            {totalBalance && totalBalance < 0 ? (
              <p className="text-2xl font-bold text-orange-500">
                ${totalBalance}
              </p>
            ) : (
              <p className="text-2xl font-bold text-green-500">
                ${totalBalance}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
