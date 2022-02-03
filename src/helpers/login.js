import React, { useState, useEffect } from "react";
import * as datahandler from "./dataHandler";
import axios from "axios";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    console.log("useeffect");
  }, []);

  const login = async () => {
    axios
      .post(`${process.env.REACT_APP_API_URL}/auth/login`, {
        username: username,
        password: password,
      })
      .then(async (response) => {
        console.log("Response", response);
      })
      .catch((error) => {
        console.log(error);
      });
    // console.log(state, "===state");
  };

  return (
    <div style={{ backgroundColor: "#ddd", height: "100vh" }}>
      <div className="login-wrapper">
        <h1>Login</h1>
        <input
          type="email"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          name="username"
        ></input>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          name="password"
        ></input>
        <button onClick={login}>Login</button>
      </div>
    </div>
  );
};

export default Login;
