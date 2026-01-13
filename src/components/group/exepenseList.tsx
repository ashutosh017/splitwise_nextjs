import { format } from "date-fns"; // Standard for date formatting
import { Receipt, Info } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface ExpenseListProps {
    expenses: any[]; // Replace with your Prisma generated type
}

export function ExpenseList({ expenses }: ExpenseListProps) {
    if (expenses.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-muted/20 rounded-xl border border-dashed border-white/10">
                <Receipt className="h-10 w-10 text-muted-foreground mb-4 opacity-20" />
                <p className="text-muted-foreground text-sm">No expenses recorded yet.</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {expenses.map((expense) => (
                <div
                    key={expense}
                    className="group flex items-center justify-between p-4 rounded-xl border border-white/10 bg-card hover:bg-white/5 transition-all cursor-pointer"
                >
                    <div className="flex items-center gap-4">
                        {/* Date Box */}
                        <div className="flex flex-col items-center justify-center w-12 h-12 rounded-lg bg-secondary text-muted-foreground">
                            <span className="text-[10px] uppercase font-bold">
                                {/* {format(new Date(expense.createdAt), "MMM")} */}
                            </span>
                            <span className="text-lg font-bold leading-none">
                                {/* {format(new Date(expense.createdAt), "dd")} */}
                            </span>
                        </div>

                        {/* Expense Info */}
                        <div>
                            <h3 className="font-medium text-base group-hover:text-primary transition-colors">
                                {expense.description}
                            </h3>
                            <p className="text-xs text-muted-foreground">
                                {/* Paid by <span className="font-semibold">{expense.createdBy.name}</span> */}
                                Paid by <span className="font-semibold">user79</span>
                            </p>
                        </div>
                    </div>

                    {/* Amount Display */}
                    <div className="text-right">
                        <p className="text-sm font-bold text-foreground">
                            {/* ${expense.amount.toFixed(2)} */}
                            $69
                        </p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                            Total Amount
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}