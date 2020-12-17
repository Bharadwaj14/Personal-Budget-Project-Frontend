import React, { useContext } from "react";
import { useHistory, Link } from "react-router-dom";
import UserContext from "../../context/UserContext";
import HomePage from "../pb/HomePage";

export default function PersonalBudgetNavigation() {
  const { userData, setUserData } = useContext(UserContext);
  const history = useHistory();
  const budget = () => history.push("/budget");
  const expense = () => history.push("/expense");
  const logout = () => {
    setUserData({
      token: undefined,
      user: undefined,
    });
    localStorage.setItem("auth-token", "");
  };
  return (
    <div>
      <div className="personalbudgetnav">
        <ul>
          <li>
            <Link to="/">HomePage</Link>
          </li>
          <li>
            <Link to="/user_dashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/user_budget">Add Budget</Link>
          </li>
          <li>
            <Link to="/user_expense">Add Expense</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
