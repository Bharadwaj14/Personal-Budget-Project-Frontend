import React, { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import HomePage from "./components/pb/HomePage";
import login from "./components/auth/Login";
import register from "./components/auth/Register";
import user_dashboard from "./components/pb/UserDashboard";
import user_budget from "./components/pb/UserBudget";
import user_expense from "./components/pb/UserExpense";
import Header from "./components/layout/Header";
import UserContext from "./context/UserContext";
import Axios from "axios";
import "./style.css";

export default function App() {
  const [userData, setUserData] = useState({
    token: undefined,
    user: undefined,
  });

  useEffect(() => {
    const verifyLogin = async () => {
      let token = localStorage.getItem("auth-token");
      if (token === null) {
        localStorage.setItem("auth-token", "");
        token = "";
      }
      const tokenRes = await Axios.post(
        "http://localhost:5000/users/tokenIsValid",
        null,
        { headers: { "x-auth-token": token } }
      );
      if (tokenRes.data) {
        const userRes = await Axios.get("http://localhost:5000/users/", {
          headers: { "x-auth-token": token },
        });
        setUserData({
          token,
          user: userRes.data,
        });
      }
    };
    verifyLogin();
  }, []);
  return (
    <>
      <BrowserRouter>
        <UserContext.Provider value={{ userData, setUserData }}>
          <Header />
          <div className="container">
            <Switch>
              {userData.user === undefined?
              <Route path="/login" component={login}></Route>
              :(
              <>
              <Route exact path="/" component={HomePage}></Route>
              <Route path="/login" component={login}></Route>
              <Route path="/register" component={register}></Route>
              <Route path="/user_dashboard" component={user_dashboard}></Route>
              <Route path="/user_budget" component={user_budget}></Route>
              <Route path="/user_expense" component={user_expense}></Route>
              </>
              )}
            </Switch>
          </div>
        </UserContext.Provider>
      </BrowserRouter>
    </>
  );
}
