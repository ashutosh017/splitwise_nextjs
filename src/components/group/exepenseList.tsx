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
import { getCurrentUser } from "@/app/actions/auth";

export async function ExpenseList({ expenses }: { expenses: any[] }) {
    const currentUserr = await getCurrentUser();
    return (
        <div className="space-y-3">
            {expenses.map((expense) => (
                <Sheet key={expense.id}>
                    <SheetTrigger asChild>
                        <div className="group grid grid-cols-[auto_1fr_auto] lg:grid-cols-[auto_1fr_120px_150px_120px_100px] items-center gap-4 p-4 rounded-xl border border-white/10 bg-card hover:bg-white/5 transition-all cursor-pointer">

                            {/* 1. Date */}
                            <div className="flex flex-col items-center justify-center w-12 h-12 rounded-lg bg-secondary/50 text-muted-foreground shrink-0">
                                <span className="text-[10px] uppercase font-bold">{format(new Date(expense.dateCreated), "MMM")}</span>
                                <span className="text-lg font-bold leading-none">{format(new Date(expense.dateCreated), "dd")}</span>
                            </div>

                            {/* 2. Description */}
                            <div className="flex flex-col min-w-0">
                                <h3 className={`font-medium truncate ${!expense.description && 'text-muted-foreground italic'}`}>
                                    {expense.description || "No Description"}
                                </h3>
                                <p className="text-xs text-muted-foreground truncate lg:hidden">
                                    Paid by {expense.whoPaid.name} • {expense.splitType.toLowerCase()}
                                </p>
                            </div>

                            {/* 3. DESKTOP ONLY: Split Type Badge */}
                            <div className="hidden lg:flex flex-col items-start">
                                <span className="text-[10px] text-muted-foreground uppercase font-semibold mb-1">Method</span>
                                <div className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                                    {expense.splitType}
                                </div>
                            </div>

                            {/* 4. DESKTOP ONLY: Payer Name */}
                            <div className="hidden lg:flex flex-col">
                                <span className="text-[10px] text-muted-foreground uppercase font-semibold">Paid by</span>
                                <span className="text-sm truncate">{expense.whoPaid.name}</span>
                            </div>

                            {/* 5. DESKTOP ONLY: Participation */}
                            <div className="hidden lg:flex flex-col items-center">
                                <span className="text-[10px] text-muted-foreground uppercase font-semibold mb-1">Split with</span>
                                <div className="flex -space-x-2">
                                    {expense.splits.slice(0, 3).map((split: any) => (
                                        <div key={split.member.id} className="h-6 w-6 rounded-full border-2 border-card bg-primary/10 flex items-center justify-center text-[10px] font-bold">
                                            {split.member.name[0]}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* 6. Amount & Status */}
                            <div className="text-right">
                                <p className="text-sm font-bold">${Number(expense.amount).toFixed(2)}</p>
                                <p className={`text-[10px] font-bold uppercase tracking-tight ${expense.whoPaid.id === currentUserr?.id ? 'text-green-500' : 'text-orange-500'
                                    }`}>
                                    {expense.whoPaid.id === currentUserr?.id ? 'You Lent' : 'You Owe'}
                                </p>
                            </div>
                        </div>
                    </SheetTrigger>

                    <SheetContent className="w-full px-4 sm:max-w-md border-white/10 bg-card text-foreground overflow-y-auto">
                        <SheetHeader className="border-b border-white/5 pb-6 text-left">
                            {/* The "Title" of the expense */}
                            <SheetTitle className="text-2xl font-bold truncate">
                                {expense.description || "Untitled Expense"}
                            </SheetTitle>

                            <div className="flex flex-col gap-1">
                                <SheetDescription className="text-lg font-semibold text-primary">
                                    Total: ${Number(expense.amount).toFixed(2)}
                                </SheetDescription>
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                    Added on {format(new Date(expense.dateCreated), "PPPP")}
                                </p>
                            </div>
                        </SheetHeader>

                        <div className="py-6 space-y-6">
                            {/* NEW: Dedicated Description/Notes Section */}
                            {expense.description && (
                                <div className="space-y-2">
                                    <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Details</h4>
                                    <p className="text-sm text-foreground/90 leading-relaxed bg-white/5 p-3 rounded-lg border border-white/5">
                                        {expense.description}
                                    </p>
                                </div>
                            )}

                            {/* Payer Section */}
                            <div>
                                <h4 className="text-sm font-medium mb-3 text-muted-foreground uppercase tracking-wider">Paid By</h4>
                                <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/10 border border-primary/20">
                                    <Avatar className="h-8 w-8 ring-2 ring-primary/20">
                                        <AvatarFallback>{expense.whoPaid.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                        <span className="font-medium text-sm">{expense.whoPaid.name}</span>
                                        <span className="text-[10px] text-muted-foreground italic">Full amount paid</span>
                                    </div>
                                    <span className="ml-auto font-bold text-primary">${Number(expense.amount).toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Splits Section */}
                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Split Breakdown</h4>
                                    <span className="text-[10px] bg-secondary px-2 py-0.5 rounded text-secondary-foreground font-bold">
                                        {expense.splitType}</span>
                                </div>
                                <div className="space-y-1 bg-white/5 rounded-lg border border-white/5 overflow-hidden">
                                    {expense.splits.map((split: any) => (
                                        <div key={split.member.id} className="flex items-center justify-between text-sm p-3 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                                            <span className="text-foreground/80">{split.member.name}</span>
                                            <span className="font-mono font-semibold">
                                                {expense.splitType === 'EQUAL' || expense.splitType === 'AMOUNT'
                                                    ? `$${Number(split.value).toFixed(2)}`
                                                    : `${split.value}${expense.splitType === 'PERCENTAGE' ? '%' : ' shares'}`}
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