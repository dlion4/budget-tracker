"use client";
import React from "react";
import {UserSettings} from "@prisma/client";
import {differenceInDays, startOfMonth} from "date-fns";
import {DateRangePicker} from "@/components/ui/date-range-picker";
import {fromJSON} from "postcss";
import {MAX_DATE_RANGE_DAYS} from "@/lib/constants";
import {toast} from "sonner";
import {error} from "console";
import StatsCards from "./StatsCards";
import CategoriesStats from "./CategoriesStats";

function OverView({userSettings} : {
  userSettings: UserSettings
}) {
  const [dateRange, setDateRange] = React.useState < {
    from: Date;
    to: Date;
  } > ({
    from: startOfMonth(new Date()),
    to: new Date()
  });
  return (<> {
    " "
  } < div className = "container flex flex-wrap justify-between gap-2 py-6" > {
    " "
  } < h2 className = "text-3xl font-bold" > Overview</h2> {
    " "
  } < div className = "flex items-center gap-3" > {
    " "
  } < DateRangePicker initialDateFrom = {
    dateRange.from
  }
  initialDateTo = {
    dateRange.to
  }
  showCompare = {
    false
  }
  onUpdate = {
    value => {
      const {from, to} = value.range;
      if (!from || !to) 
        return;
      if (differenceInDays(to, from) > MAX_DATE_RANGE_DAYS) {
        toast.error(`Allowed selected dat range is ${MAX_DATE_RANGE_DAYS} days`);
        return;
      }
      setDateRange({from, to});
    }
  } /> {
    " "
  } < /div>
      </div > <div className="container flex gap-2 w-full flex-col">
    <StatsCards userSettings={userSettings} from={dateRange.from} to={dateRange.to}/>
    <CategoriesStats userSettings={userSettings} from={dateRange.from} to={dateRange.to}/>
  </div>
</>);
}

export default OverView;
