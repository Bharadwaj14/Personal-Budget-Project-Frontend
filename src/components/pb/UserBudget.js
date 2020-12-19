import React, { useEffect, useContext, useState } from "react";
import { useHistory, Link } from "react-router-dom";
import UserContext from "../../context/UserContext";
import PersonalBudgetNavigation from "../layout/PersonalBudgetNavigation";
import ErrorNotice from "../../misc/ErrorNotice";
import Axios from "axios";
const SERVER_URL = require('../../config/redirect').SERVER_URL;
export default function UserBudget() {
  const [category, setCategory] = useState();
  const [budget, setBudget] = useState();
  const [error, setError] = useState();
  const { userData, setUserData } = useContext(UserContext);
  const history = useHistory();
  useEffect(() => {
    if (!userData.user) history.push("/login");
  });
  const submit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("auth-token");
      const userBudget = { category, budget };
      console.log("bharadwaj");
      console.log(userBudget);
      await Axios.post(SERVER_URL+"/budget/add", userBudget, {
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
            <h1>Add Budget Per Month</h1>
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
              <label htmlFor="budget">Budget</label>
              <input
                id="budget"
                type="text"
                onChange={(e) => setBudget(e.target.value)}
              />

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
