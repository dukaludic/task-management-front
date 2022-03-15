import React, { useState, useEffect, useContext } from "react";
import * as datahandler from "./dataHandler";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { Auth } from "../context/AuthContext";
import jwt_decode from "jwt-decode";

// import globalState from "../context/globalState";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [credentialsValid, setCredentialsValid] = useState(true);

  const context = useContext(Auth);

  const navigate = useNavigate();

  // const context = useContext(globalState);

  useEffect(() => {
    console.log("useeffect");
    // const token = localStorage.getItem("access_token");

    console.log(context.state, "===context");
    if (context.state.isAuthenticated) {
      console.log("redirect");
      navigate("dashboard");
    }
  }, []);

  // this.context.dispatch({
  //   type: "SET_DATA",
  //   payload: {
  //     ...this.context.state.data,
  //     cart: cart,
  //   },
  // });

  const login = async () => {
    console.log("login");
    axios
      .post(`${process.env.REACT_APP_API_URL}/login`, {
        username: username,
        password: password,
      })
      .then(async (response) => {
        localStorage.setItem("access_token", response.data.access_token);
        const decoded = jwt_decode(response.data.access_token);
        console.log(decoded, "===decoded");
        // Gde da cuvam podatke o useru, dal u contextu ili localstorage
        // const userData = await datahandler.show("users", decoded._id);
        context.dispatch({ type: "LOGIN", payload: decoded });
        navigate("dashboard");
      })
      .catch((error) => {
        setCredentialsValid(false);
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
        <button
          onClick={() => {
            navigate("/register");
          }}
        >
          Register
        </button>
        {!credentialsValid && <p>Invalid Credentials</p>}
      </div>
    </div>
  );
};

export default Login;
