'use client';

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CheckCircle2, ArrowRight, Info } from "lucide-react";
import { settleDebtAction } from "@/app/actions/group";
import { DetailedGroupData } from "@/interfaces";


export interface OptimizedSettlement {
    fromMemberId: string;
    fromName: string;
    toMemberId: string;
    toName: string;
    amount: number;
}

export function getOptimizedSettlements(members: DetailedGroupData['members'], netBalance: Record<string, number>): OptimizedSettlement[] {
    // 1. Calculate net balance for each member
    // (In a real app, you'd pull this from your balanceService)
    const membersWithBalances = members.map((m) => ({
        ...m,
        // Fallback to 0 if the ID isn't found in the record
        netBalance: netBalance[m.member.id] || 0
    }));
    let debtors = membersWithBalances
        .filter((m) => m.netBalance < 0)
        .map((m) => ({ ...m, netBalance: Math.abs(m.netBalance) }))
        .sort((a, b) => b.netBalance - a.netBalance);

    let creditors = membersWithBalances
        .filter((m) => m.netBalance > 0)
        .sort((a, b) => b.netBalance - a.netBalance);

    const settlements: OptimizedSettlement[] = [];

    let i = 0, j = 0;
    while (i < debtors.length && j < creditors.length) {
        const amount = Math.min(debtors[i].netBalance, creditors[j].netBalance);

        if (amount > 0.01) {
            settlements.push({
                fromMemberId: debtors[i].member.id,
                fromName: debtors[i].member.name,
                toMemberId: creditors[j].member.id,
                toName: creditors[j].member.name,
                amount: Number(amount.toFixed(2)),
            });
        }

        debtors[i].netBalance -= amount;
        creditors[j].netBalance -= amount;

        if (debtors[i].netBalance < 0.01) i++;
        if (creditors[j].netBalance < 0.01) j++;
    }

    return settlements;
}
export function SettleGroupDialog({ group, netBalances }: { group: DetailedGroupData, netBalances: Record<string, number> }) {
    const [loading, setLoading] = useState<string | null>(null);

    // Assuming group.members includes a pre-calculated 'netBalance'
    const settlements = getOptimizedSettlements(group.members, netBalances);

    const handleSettle = async (s: any) => {
        setLoading(s.fromMemberId + s.toMemberId);
        await settleDebtAction(group.id, s.fromMemberId, s.toMemberId, s.amount);
        setLoading(null);
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className="text-green-500 border-green-500/20 hover:bg-green-500/10">
                    <CheckCircle2 className="mr-2 h-4 w-4" /> Settle Up
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[480] bg-card border-white/10">
                <DialogHeader>
                    <DialogTitle>Group Settlement Summary</DialogTitle>
                </DialogHeader>

                <div className="space-y-6 pt-4">
                    {/* Section 1: Net Positions */}
                    <div className="space-y-3">
                        <h4 className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Individual Status</h4>
                        <div className="grid grid-cols-2 gap-2">
                            {group.members.map((m: any) => (
                                <div key={m.member.id} className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/5">
                                    <Avatar className="h-6 w-6">
                                        <AvatarFallback className="text-[10px]">{m.member.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-xs truncate font-medium">{m.member.name}</span>
                                        <span className={`text-[10px] font-bold ${netBalances[m.member.id] >= 0 ? 'text-green-500' : 'text-orange-500'}`}>
                                            {netBalances[m.member.id] >= 0 ? '+' : ''}${Number(netBalances[m.member.id]).toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Section 2: Optimized Settlements */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h4 className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Suggested Payments</h4>
                            <div className="group relative">
                                <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                                <div className="absolute bottom-full right-0 mb-2 w-48 p-2 bg-popover text-[10px] rounded border border-white/10 hidden group-hover:block shadow-xl">
                                    Debts are simplified to reduce the total number of payments needed.
                                </div>
                            </div>
                        </div>

                        {settlements.length === 0 ? (
                            <div className="text-center py-8 border-2 border-dashed border-white/5 rounded-xl">
                                <p className="text-sm text-muted-foreground">Everyone is settled up! 🎉</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {settlements.map((s, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-primary/5 border border-primary/10">
                                        <div className="flex items-center gap-3">
                                            <div className="text-left">
                                                <p className="text-[10px] text-muted-foreground uppercase font-bold">From</p>
                                                <p className="text-sm font-medium">{s.fromName}</p>
                                            </div>
                                            <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                            <div className="text-left">
                                                <p className="text-[10px] text-muted-foreground uppercase font-bold">To</p>
                                                <p className="text-sm font-medium">{s.toName}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <span className="text-lg font-mono font-bold text-primary">${s.amount}</span>
                                            <Button
                                                size="sm"
                                                variant="secondary"
                                                className="h-7 text-[10px]"
                                                disabled={loading === s.fromMemberId + s.toMemberId}
                                                onClick={() => handleSettle(s)}
                                            >
                                                {loading === s.fromMemberId + s.toMemberId ? "Recording..." : "Mark as Paid"}
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}