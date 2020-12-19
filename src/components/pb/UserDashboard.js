import React, { useEffect, useContext } from "react";
import PersonalBudgetNavigation from "../layout/PersonalBudgetNavigation";
import RadarChart from "../charts/RadarChart";
import BarChart from "../charts/BarChart";
import DonutChart from "../charts/DonutChart";
import { useHistory, Link } from "react-router-dom";
import UserContext from "../../context/UserContext";

export default function Dashboard() {
  const { userData, setUserData } = useContext(UserContext);
  const history = useHistory();
  useEffect(() => {
    if (!userData.user) {
      history.push("/login");
    }
  });
  return (
    <main className="dashboardCharts">
      <PersonalBudgetNavigation />
      <RadarChart />
      <BarChart />
      <DonutChart />
    </main>
  );
}
