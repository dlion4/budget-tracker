"use client";

import {Badge} from "@/components/ui/badge";
import {Card, CardHeader, CardTitle} from "@/components/ui/card";
import {GetFormatterForCurrency} from "@/lib/helpers";
import {Period, TimeFrame} from "@/lib/types";
import {UserSettings} from "@prisma/client";
import React, {useMemo} from "react";
import HistoryPeriodSelector from "./HistoryPeriodSelector";
import {useQuery} from "@tanstack/react-query";
import {getHistoryDataType} from "@/app/api/history-data/route";

export default function History({userSettings} : {
  userSettings: UserSettings;
}) {
  const [timeFrame, setTimeFrame] = React.useState<TimeFrame>("month");

  const [period, setPeriod] = React.useState<Period>({month: new Date().getMonth(), year: new Date().getFullYear()});

  const formatter = useMemo(() => {
    return GetFormatterForCurrency(userSettings.currency);
  }, [userSettings.currency]);

  const historyDataQuery = useQuery<getHistoryDataType>({
    queryKey: [
      "overview", "history", timeFrame, period
    ],
    queryFn: () => fetch(`/api/history-data?timeframe=${timeFrame}&year=${period.year}$month=${period.month}`).then((res) => res.json())
  });

  const dataAvailable = historyDataQuery.data && historyDataQuery.data.length > 0

  return (<div className="container">
    <h2 className="mt-12 text-3xl font-bold">History</h2>
    <Card className="col-span-12 mt-2 w-full">
      <CardHeader className="gap-2">
        <CardTitle className="grid grid-flow-row justify-between gap-2 md:grid-flow-col">
          <HistoryPeriodSelector period={period} setPeriod={setPeriod} timeframe={timeFrame} setTimeframe={setTimeFrame}/>

          <div className="flex h-10 gap-2">
            <Badge variant={"outline"} className="flex items-center gap-2 text-sm">
              <div className="h-4 w-4 rounded-full bg-emerald-500"></div>{" "}
              Income
            </Badge>
            <Badge variant={"outline"} className="flex items-center gap-2 text-sm">
              <div className="h-4 w-4 rounded-full bg-red-500"></div>
              Expenses
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
    </Card>
  </div>);
}
