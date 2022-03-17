import React, { useState, useEffect, useContext } from "react";
import * as datahandler from "./dataHandler";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { Auth } from "../context/AuthContext";
import jwt_decode from "jwt-decode";

import logoMark from "../assets/images/grape-logo-mark-160322.svg";
import logoDark from "../assets/images/grape-logo-dark-160322.svg";

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

    console.log(context.state, "===context");
    if (context.state.isAuthenticated) {
      console.log("redirect");
      navigate("dashboard");
    }
  }, []);

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
      <div className="login-register-container">
        <div className="login-register-image-container">
          <img className="login-register-image" src={logoMark} />
        </div>
        <div className="login-register-input-container">
          <div className="login-register-inputs">
            <div
              style={{ marginBottom: "30px", position: "relative" }}
              className="w-100"
            >
              <span className="b-1">Welcome to</span>
              <span>
                <img id="loginLogo" src={logoDark} />
              </span>
              <p
                style={{ position: "absolute", bottom: "-10px" }}
                className="b-3"
              >
                Login
              </p>
            </div>
            <div className="w-100">
              <p className="b-2">Username</p>
              <input
                className="login-input"
                type="email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                name="username"
                placeholder="Your username"
              ></input>
            </div>
            <div
              style={{ marginTop: "30px", marginBottom: "30px" }}
              className="w-100"
            >
              <p className="b-2">Last name</p>
              <input
                className="login-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                name="password"
                placeholder="Your password"
              ></input>
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <span
                className="login-register-switch b-3"
                onClick={() => {
                  navigate("/register");
                }}
              >
                New user?
              </span>
              <button className="btn-default-g b-3" onClick={login}>
                Login
              </button>
              {!credentialsValid && (
                <span className="credentials-error">Invalid Credentials</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
