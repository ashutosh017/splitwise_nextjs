import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Receipt, UserPlus, TrendingUp, TrendingDown, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { verifyToken } from "../actions/auth";
import { CreateGroupDialog } from "@/components/group/createGroupDialog";
import { findGroups } from "../actions/group";
import { GroupCard } from "@/components/group/groupCard";
import { getOwedOwnBalanceDistribution } from "../actions/balance";

export default async function DashboardPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) redirect("/signin");
    const auth = await verifyToken({ token });
    if (!auth.success) redirect("/signin");

    const user = auth.data;

    console.log("user: ", user);

    const userGroups = (await findGroups(user.id)).data

    console.log("groups: ", userGroups);

    const owedOwnedDist = await getOwedOwnBalanceDistribution();
    // 'owned' (positive values) is what others owe YOU
    const totalOwedToYou = owedOwnedDist.owned;

    // 'owed' (negative values) is what YOU owe others
    const totalYouOwe = Math.abs(owedOwnedDist.owed);

    // Your net position
    const netBalance = totalOwedToYou - totalYouOwe;

    return (
        <div className="space-y-8 pb-10 px-4">
            {/* Header Section */}
            <div className="flex items-center justify-between border-b border-white/10 pb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground">Welcome back, {user.name}</p>
                </div>
                <div className="mt-2">
                    <CreateGroupDialog />
                </div>
                {/* <Button><Receipt className="mr-2 h-4 w-4" /> Add Expense</Button> */}
            </div>
            {/* Balance Overview Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="border-white/10 bg-card">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold ${netBalance >= 0 ? 'text-green-500' : 'text-orange-500'}`}>
                            {netBalance >= 0 ? `+ $${netBalance}` : `- $${Math.abs(netBalance)}`}
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-white/10 bg-card">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">You are owed</CardTitle>
                        <TrendingUp className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-500">$ {totalOwedToYou}</div>
                    </CardContent>
                </Card>

                <Card className="border-white/10 bg-card">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">You owe</CardTitle>
                        <TrendingDown className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-500">$ {totalYouOwe}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Area */}
            <div className="grid gap-8 md:grid-cols-2">
                {/* <section className="space-y-4">
                    <h2 className="text-xl font-semibold">Recent Activity</h2>
                    <div className="rounded-xl border border-white/10 p-4 text-sm text-muted-foreground text-center py-10">
                        No recent expenses to show.
                    </div>
                </section> */}

                <section className="space-y-4">
                    <h2 className="text-xl font-semibold">Your Groups</h2>

                    {userGroups && userGroups.length > 0 ? (
                        <div className="grid gap-4 lg:grid-cols-2">
                            {userGroups.map((group) => (
                                <GroupCard key={group.id} group={group} />
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-xl border border-white/10 p-4 text-sm text-muted-foreground text-center py-10">
                            You haven't joined any groups yet.
                        </div>
                    )}
                </section>
            </div>

        </div>
    );
}