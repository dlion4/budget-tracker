"use client";

import { GetBalanceStatsResponseType } from "@/app/api/stats/balance/route";
import SkeletonWrapper from "@/components/SkeletonWrapper";
import { Card } from "@/components/ui/card";
import { DateToUTCDate, GetFormatterForCurrency } from "@/lib/helpers";
import { UserSettings } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { ReactNode, useCallback, useMemo } from "react";
import CountUp from "react-countup"
function StatsCards({ userSettings, from, to }: {
    userSettings: UserSettings;
    from: Date;
    to: Date;
}) {
    const statsQuery = useQuery<GetBalanceStatsResponseType>({
        queryKey: [
            "overview", "stats", from, to
        ],
        queryFn: async () => {
            const response = await fetch(`/api/stats/balance?from=${DateToUTCDate(from)}&to=${DateToUTCDate(to)}`);
            return response.json();
        }
    });

    const formatter = useMemo(() => {
        return GetFormatterForCurrency(userSettings.currency);
    }, [userSettings.currency]);

    const income = statsQuery.data?.income || 0
    const expense = statsQuery.data?.expense || 0

    const balance = income - expense


    return <div className="relative flex w-full flex-wrap gap-2 md:flex-nowrap">
        <SkeletonWrapper isLoading={statsQuery.isFetching}>
            <StatCard
                formatter={formatter}
                value={income}
                title="Income"
                icon={
                    <TrendingUp className="h-12 w-12 items-center p-2 rounded-lg text-emerald-500 bg-emerald-400/10" />
                }
            />
        </SkeletonWrapper>
        <SkeletonWrapper isLoading={statsQuery.isFetching}>
            <StatCard
                formatter={formatter}
                value={expense}
                title="Expense"
                icon={
                    <TrendingDown className="h-12 w-12 items-center p-2 rounded-lg text-red-500 bg-red-400/10" />
                }
            />
        </SkeletonWrapper>
        <SkeletonWrapper isLoading={statsQuery.isFetching}>
            <StatCard
                formatter={formatter}
                value={balance}
                title="Balance"
                icon={
                    <Wallet className="h-12 w-12 items-center p-2 rounded-lg text-violet-500 bg-violet-400/10" />
                }
            />
        </SkeletonWrapper>
    </div>;
}
export default StatsCards;


export function StatCard({
    formatter,
    value,
    title,
    icon
}: {
    formatter: Intl.NumberFormat
    value: number
    title: String,
    icon: ReactNode
}) {
    const formatFn = useCallback((value: number) => {
        return formatter.format(value)
    }, [formatter])


    return (
        <Card className="flex h-24 w-full items-center gap-2 p-4">
            {icon}
            <div className="flex flex-col items-start gap-0">
                <p className="text-muted-foreground">{title}</p>
                <CountUp
                    preserveValue
                    redraw={false}
                    end={value}
                    decimals={2}
                    formattingFn={formatFn}
                    className="text-2xl"
                />
            </div>
        </Card>
    )
}