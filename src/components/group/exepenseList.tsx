import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { format } from "date-fns";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function ExpenseList({ expenses }: { expenses: any[] }) {
    return (
        <div className="space-y-3">
            {expenses.map((expense) => (
                <Sheet key={expense.id}>
                    <SheetTrigger asChild>
                        {/* Your existing clickable card */}
                        <div className="group flex items-center justify-between p-4 rounded-xl border border-white/10 bg-card hover:bg-white/5 transition-all cursor-pointer">
                            <div className="flex items-center gap-4">
                                <div className="flex flex-col items-center justify-center w-12 h-12 rounded-lg bg-secondary text-muted-foreground">
                                    <span className="text-[10px] uppercase font-bold">{format(new Date(expense.dateCreated), "MMM")}</span>
                                    <span className="text-lg font-bold leading-none">{format(new Date(expense.dateCreated), "dd")}</span>
                                </div>
                                <div>
                                    <h3 className="font-medium">{expense.description}</h3>
                                    <p className="text-xs text-muted-foreground">Paid by {expense.whoPaid.name}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-bold">${Number(expense.amount).toFixed(2)}</p>
                            </div>
                        </div>
                    </SheetTrigger>

                    <SheetContent className="w-full px-4 sm:max-w-md border-white/10 bg-card text-foreground">
                        <SheetHeader className="border-b border-white/5 pb-6">
                            <SheetTitle className="text-2xl">{expense.description}</SheetTitle>
                            <SheetDescription className="text-lg font-semibold text-primary">
                                Total: ${Number(expense.amount).toFixed(2)}
                            </SheetDescription>
                            <p className="text-xs text-muted-foreground">
                                Added on {format(new Date(expense.dateCreated), "PPPP")}
                            </p>
                        </SheetHeader>

                        <div className="py-6 space-y-6">
                            {/* Payer Section */}
                            <div>
                                <h4 className="text-sm font-medium mb-3 text-muted-foreground uppercase tracking-wider">Paid By</h4>
                                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback>{expense.whoPaid.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <span className="font-medium">{expense.whoPaid.name}</span>
                                    <span className="ml-auto font-bold">${Number(expense.amount).toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Splits Section */}
                            <div>
                                <h4 className="text-sm font-medium mb-3 text-muted-foreground uppercase tracking-wider">Split Breakdown ({expense.splitType})</h4>
                                <div className="space-y-2">
                                    {expense.splits.map((split: any) => (
                                        <div key={split.member.id} className="flex items-center justify-between text-sm py-2 border-b border-white/5 last:border-0">
                                            <div className="flex items-center gap-2">
                                                <span className="text-muted-foreground">{split.member.name}</span>
                                            </div>
                                            <span className="font-mono">
                                                {expense.splitType === 'EQUAL' ? `$${Number(split.value).toFixed(2)}` : `${split.value}${expense.splitType === 'PERCENTAGE' ? '%' : ''}`}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            ))}
        </div>
    );
}