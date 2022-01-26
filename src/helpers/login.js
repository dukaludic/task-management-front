import React, { useState, useEffect } from "react";
// import * as datahandler from "./dataHandler";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    console.log("useeffect");
  }, []);

  const login = () => {
    console.log(username, password);
  };

  return (
    <div>
      <h1>Login</h1>
      <div>
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
