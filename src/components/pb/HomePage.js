import React, { useEffect, useContext } from "react";
import { useHistory, Link } from "react-router-dom";
import UserContext from "../../context/UserContext";
import PersonalBudgetNavigation from "../layout/PersonalBudgetNavigation";

export default function HomePage() {
  const { userData } = useContext(UserContext);
  const history = useHistory();

  useEffect(() => {
    if (!userData.user) history.push("/login");
  });
  return (
    <>
      <PersonalBudgetNavigation />
      <div className="page">
        {userData.user ? (
          <>
            <h1>{userData.user.displayName}: Welcome to Personal Budget</h1>
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
