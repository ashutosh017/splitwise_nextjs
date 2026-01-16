'use server'

import { balanceService } from "@/di/container";
import { ActionResponse, catchErrors } from "@/lib/action-wrapper";
import { getCurrentUser } from "./auth";
import { redirect } from "next/navigation";

export async function getTotalBalanceDistribution(): Promise<ActionResponse<Record<string, number>>> {
    const user = await getCurrentUser();
    if (!user) redirect("/signin");

    return catchErrors(async () => {
        const map = await balanceService.getCompleteBalanceDistribution(user.id);
        return Object.fromEntries(map);
    });
}

interface OwedOwnedDistribution { totalBalance: number, owed: number, owned: number }
export async function getOwedOwnBalanceDistribution(): Promise<OwedOwnedDistribution> {
    const distribution: OwedOwnedDistribution = { totalBalance: 0, owed: 0, owned: 0 };
    const balanceMapResp = await getTotalBalanceDistribution();
    if (!balanceMapResp.success || !balanceMapResp.data) return distribution;

    const balanceData = balanceMapResp.data;

    Object.values(balanceData).forEach((val) => {
        const amount = Number(val);
        if (amount < 0) {
            distribution.owed += Math.abs(amount); // Keep owed as a positive "debt" number
        } else {
            distribution.owned += amount; // This is money lent out
        }
        distribution.totalBalance += amount;
    });

    return distribution;
}