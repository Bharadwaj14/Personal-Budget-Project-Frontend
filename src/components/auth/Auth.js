import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import UserContext from "../../context/UserContext";

export default function Auth() {
  const { userData, setUserData } = useContext(UserContext);
  const history = useHistory();
  const register = () => history.push("/register");
  const login = () => history.push("/login");
  const logout = () => {
    setUserData({
      token: undefined,
      user: undefined,
    });
    localStorage.setItem("auth-token", "");
    history.push("/login");
  };
  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch (err) {
      return null;
    }
  };
  function onTokenExpire() {
    let token = localStorage.getItem("auth-token");
    if (token) {
      let decodejwt = parseJwt(token);
      if (Date.now() <= decodejwt.exp * 1000) {
        return true;
      } else {
        logout();
      }
    }
  } 

  setInterval(() => {
    onTokenExpire();
  }, 10000);
  return (
    <nav className="auth-options">
      {userData.user ? (
        <button onClick={logout}>Logout</button>
      ) : (
        <>
          <button onClick={register}>Register</button>
          <button onClick={login}>Login</button>
        </>
      )}
    </nav>
  );
}
