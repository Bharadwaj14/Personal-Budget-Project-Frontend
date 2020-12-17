import React from "react";
import PersonalBudgetNavigation from "../layout/PersonalBudgetNavigation";
import RadarChart from "../charts/RadarChart";
import BarChart from "../charts/BarChart";
import DonutChart from "../charts/DonutChart";

export default function Dashboard() {
  return (
    <div className="dashboardCharts">
      <PersonalBudgetNavigation />
      <RadarChart />
      <BarChart />
      <DonutChart />
    </div>
  );
}
