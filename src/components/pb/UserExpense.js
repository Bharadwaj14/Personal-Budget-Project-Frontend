import React, { useEffect, useContext, useState } from "react";
import { useHistory, Link } from "react-router-dom";
import UserContext from "../../context/UserContext";
import PersonalBudgetNavigation from "../layout/PersonalBudgetNavigation";
import ErrorNotice from "../../misc/ErrorNotice";
import Axios from "axios";
const SERVER_URL = require('../../config/redirect').SERVER_URL;
export default function UserExpense() {
  const [category, setCategory] = useState();
  const [expense, setExpense] = useState();
  const [month, setMonth] = useState();
  const { userData, setUserData } = useContext(UserContext);
  const [error, setError] = useState();
  const history = useHistory();
  useEffect(() => {
    if (!userData.user) history.push("/login");
  });
  const submit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("auth-token");
      const date = new Date();
      const userExpense = { category, expense, month, date };
      console.log(userExpense);
      await Axios.post(SERVER_URL+"/expense/add", userExpense, {
        headers: {
          "x-auth-token": `${token}`,
        },
      });
      history.push("/");
    } catch (err) {
      err.response.data.msg && setError(err.response.data.msg);
    }
  };
  return (
    <>
      <PersonalBudgetNavigation />
      <div className="page">
        {userData.user ? (
          <>
            <h1>Add Expense</h1>
            {error && (
              <ErrorNotice
                message={error}
                clearError={() => setError(undefined)}
              />
            )}
            <form className="form" onSubmit={submit}>
              <label htmlFor="category">Category</label>
              <select
                id="category"
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Broadband">Broadband</option>
                <option value="Shopping">Shopping</option>
                <option value="Groceries">Groceries</option>
                <option value="Gas Bill">Gas Bill</option>
                <option value="Electricity Bill">Electricity</option>
                <option value="Mobile Bill">Mobile Bill</option>
                <option value="Eat Out">Eat Out</option>
                <option value="Education">Education</option>
                <option value="Medical expenses">Medical expenses</option>
                <option value="Travel expenses">Travel expenses</option>
              </select>

              <label htmlFor="expense">Expense</label>
              <input
                id="cost"
                type="text"
                onChange={(e) => setExpense(e.target.value)}
              />

              <label htmlFor="month">Month</label>
              <select
                id="month"
                onChange={(e) => setMonth(e.target.value)}
              >
                <option value="January">January</option>
                <option value="February">February</option>
                <option value="March">March</option>
                <option value="April">April</option>
                <option value="May">May</option>
                <option value="June">June</option>
                <option value="July">July</option>
                <option value="August">August</option>
                <option value="September">September</option>
                <option value="October">October</option>
                <option value="November">November</option>
                <option value="December">December</option>
              </select>

              <input type="submit" value="Add" />
            </form>
          </>
        ) : (
          <>
            <h2>User not logged in</h2>
            <Link to="/login">Login</Link>
          </>
        )}
      </div>
    </>
  );
}
