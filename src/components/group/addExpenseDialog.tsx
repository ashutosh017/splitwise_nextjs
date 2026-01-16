// @ts-nocheck
'use client';

import { useState, useMemo, useActionState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Receipt } from "lucide-react";
import { CreateExpense } from "@/app/actions/expense";
import { SplitType } from "@/zod";


export function AddExpenseDialog({ group }: { group: any }) {
    const [open, setOpen] = useState(false);
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState<number>(0);
    const [splitType, setSplitType] = useState<SplitType>("EQUAL");
    const [whoPaidId, setWhoPaidId] = useState<string>(group.members[0]?.member.id);

    const [state, formAction, isPending] = useActionState(CreateExpense, null);

    const [splitValues, setSplitValues] = useState<Record<string, number>>(
        Object.fromEntries(group.members.map(m => [m.member.id, 0]))
    );

    const calculatedSplits = useMemo(() => {
        const memberCount = group.members.length;
        if (splitType === "EQUAL") {
            const equalShare = amount / (memberCount || 1);
            return group.members.map(m => ({ memberId: m.member.id, value: equalShare }));
        }
        return group.members.map(m => ({
            memberId: m.member.id,
            value: splitValues[m.member.id] || 0
        }));
    }, [amount, splitType, splitValues, group.members]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant={"outline"}><Receipt className="mr-2 h-4 w-4" /> Add Expense</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500]">
                <DialogHeader>
                    <DialogTitle>Add Expense</DialogTitle>
                </DialogHeader>

                <form action={formAction} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Description</label>
                            <Input name="description" placeholder="Dinner" required />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Total Amount</label>
                            <Input
                                type="number"
                                name="amount"
                                onChange={(e) => setAmount(Number(e.target.value))}
                                placeholder="0.00"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Paid By</label>
                            <Select value={whoPaidId} onValueChange={setWhoPaidId}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {group.members.map(m => (
                                        <SelectItem key={m.member.id} value={m.member.id}>
                                            {m.member.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Split Type</label>
                            <Select value={splitType} onValueChange={(v: SplitType) => setSplitType(v)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="EQUAL">Equally</SelectItem>
                                    <SelectItem value="AMOUNT">Exact Amounts</SelectItem>
                                    <SelectItem value="PERCENTAGE">Percentage</SelectItem>
                                    <SelectItem value="SHARE">Shares</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-3 border rounded-lg p-4 bg-muted/30">
                        <p className="text-sm font-semibold">Split Breakdown</p>
                        {group.members.map((gm) => (
                            <div key={gm.member.id} className="flex items-center justify-between gap-4">
                                <span className="text-sm flex-1 truncate">{gm.member.name}</span>
                                {splitType === "EQUAL" ? (
                                    <span className="text-sm font-mono text-muted-foreground">
                                        ${(amount / group.members.length).toFixed(2)}
                                    </span>
                                ) : (
                                    <div className="flex items-center gap-2 w-24">
                                        <Input
                                            type="number"
                                            className="h-8"
                                            placeholder="0"
                                            onChange={(e) => setSplitValues({
                                                ...splitValues,
                                                [gm.member.id]: Number(e.target.value)
                                            })}
                                            required
                                        />
                                        <span className="text-xs text-muted-foreground">
                                            {splitType === "PERCENTAGE" ? "%" : splitType === "SHARE" ? "sh" : "$"}
                                        </span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Submit Data */}
                    <input type="hidden" name="groupId" value={group.id} />
                    <input type="hidden" name="whoPaidId" value={whoPaidId} />
                    <input type="hidden" name="splitType" value={splitType} />
                    <input type="hidden" name="splits" value={JSON.stringify(calculatedSplits)} />

                    <Button type="submit" className="w-full">Save Expense</Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}