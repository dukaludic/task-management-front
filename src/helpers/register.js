import React, { useState, useEffect, useContext } from "react";
import * as datahandler from "./dataHandler";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { Auth } from "../context/AuthContext";
import logoMark from "../assets/images/grape-logo-mark-160322.svg";
import logoDark from "../assets/images/grape-logo-dark-160322.svg";
// import globalState from "../authContext/globalState";

const Login = () => {
  const [firstName, setFirstName] = useState("");
  const [firstNameValid, setFirstNameValid] = useState(false);
  const [lastName, setLastName] = useState("");
  const [lastNameValid, setLastNameValid] = useState(false);
  const [username, setUsername] = useState("");
  const [usernameValid, setUsernameValid] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordValid, setPasswordValid] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordValid, setConfirmPasswordValid] = useState(false);
  const [role, setRole] = useState(null);
  const [usernameAvailable, setUsernameAvailable] = useState(false);
  const [usedUsernames, setUsedUsernames] = useState([]);
  const [email, setEmail] = useState("");
  const [usedEmails, setUsedEmails] = useState([]);
  const [emailValid, setEmailValid] = useState(false);
  const [emailAvailable, setEmailAvailable] = useState(false);
  const [requirementsMet, setRequirementsMet] = useState(false);
  const [userRole, setUserRole] = useState("worker");
  const [userRoleValid, setUserRoleValid] = useState(false);

  const [reqNotMetShown, setReqNotMetShown] = useState(false);
  const [errorMessage, setErrorMessage] = useState("Please select role");

  const authContext = useContext(Auth);

  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const usernamesRes = await datahandler.show(
        "users/usernames",
        authContext
      );
      const emailsRes = await datahandler.show("users/emails", authContext);
      setUsedUsernames(usernamesRes);
      setUsedEmails(emailsRes);
    })();
  }, []);

  // this.authContext.dispatch({
  //   type: "SET_DATA",
  //   payload: {
  //     ...this.authContext.state.data,
  //     cart: cart,
  //   },
  // });

  const login = async (username, password) => {
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
        authContext.dispatch({ type: "LOGIN", payload: decoded });
        navigate("/dashboard");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const register = async () => {
    if (
      firstNameValid &&
      lastNameValid &&
      usernameValid &&
      usernameAvailable &&
      emailValid &&
      passwordValid &&
      confirmPasswordValid &&
      userRoleValid
    ) {
      console.log("req met");

      const newUserObj = {
        first_name: firstName,
        last_name: lastName,
        username: username,
        email: email,
        role: role,
        password: password,
      };

      console.log(newUserObj, "newuserobj");

      const newUserRes = await datahandler.create(
        "users",
        newUserObj,
        authContext
      );

      console.log(newUserRes, "newuserres");

      await login(username, password);

      return;
    } else {
      if (!firstNameValid) {
        console.log("not valid firtnam");
        setErrorMessage("First name must be at least 2 characters long");
      } else if (!lastNameValid) {
        setErrorMessage("Last name must be at least 2 characters");
      } else if (!emailValid) {
        setErrorMessage("Email is not valid");
      } else if (!usernameValid) {
        setErrorMessage("Username is not valid");
      } else if (!usernameAvailable) {
        setErrorMessage("Username already in use");
      } else if (!passwordValid) {
        setErrorMessage("Password needs to be at least 4 characters long");
      } else if (!confirmPasswordValid) {
        setErrorMessage("Passwords do not match");
      } else if (!role) {
        setErrorMessage("Please select a role");
      }
    }
    setReqNotMetShown(true);
  };

  const checkIfEmailAvailable = (email) => {
    for (let i = 0; i < usedUsernames.length; i++) {
      if (usedEmails[i].toLowerCase() === email.toLowerCase()) {
        setEmailAvailable(false);
        console.log("exists");
        return false;
      }
    }
    setEmailAvailable(true);
    return true;
  };

  const checkEmail = (email) => {
    var pattern = new RegExp(
      /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
    );
    if (!pattern.test(email)) {
      console.log("Invalid email");
      setEmailValid(false);
      return false;
    }
    setEmailValid(true);
    setErrorMessage("");
    return true;
  };

  const firstNameHandler = (e) => {
    setFirstName(e.target.value);
    if (e.target.value.length > 1) {
      setFirstNameValid(true);
      setErrorMessage("");
    } else {
      setFirstNameValid(false);
      setErrorMessage("First name must be at least 2 characters long");
    }
  };

  const lastNameHandler = (e) => {
    setLastName(e.target.value);
    if (e.target.value.length > 1) {
      setLastNameValid(true);
      setErrorMessage("");
    } else {
      setLastNameValid(false);
      setErrorMessage("Last name must be at least 2 characters");
    }
  };

  const emailHandler = (e) => {
    setEmail(e.target.value);
    var pattern = new RegExp(
      /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
    );
    if (!pattern.test(e.target.value)) {
      setEmailValid(false);
      setErrorMessage("Email is not valid");
      return false;
    }
    setErrorMessage("");
    setEmailValid(true);
    return true;
  };

  useEffect(() => {
    console.log("usernameValid", usernameValid);
  }, [usernameValid]);

  const usernameHandler = (e) => {
    setUsername(e.target.value);
    let valid;
    if (e.target.value.length > 3) {
      setErrorMessage("");
      valid = true;
    } else {
      setErrorMessage("Username needs to be at least 4 characters long");
      valid = false;
    }

    let available = true;
    if (valid) {
      for (let i = 0; i < usedUsernames.length; i++) {
        if (usedUsernames[i].toLowerCase() === e.target.value.toLowerCase()) {
          console.log("IN USE");
          available = false;
          setErrorMessage("Username already in use");
          break;
        } else {
          console.log("NOT IN USE");
          available = true;
        }
      }
    }

    setUsernameValid(valid);
    console.log(available, "===available");
    console.log(valid, "===valid");
    setUsernameAvailable(available);
  };

  const passwordHandler = (e) => {
    setPassword(e.target.value);
    if (e.target.value.length > 3) {
      setPasswordValid(true);
      setErrorMessage("");
    } else {
      setPasswordValid(false);
      setErrorMessage("Password needs to be at least 4 characters long");
    }
  };

  const confirmPasswordHandler = (e) => {
    setConfirmPassword(e.target.value);
    if (password === e.target.value) {
      setConfirmPasswordValid(true);
      setErrorMessage("");
    } else {
      setConfirmPasswordValid(false);
      setErrorMessage("Passwords do not match");
    }
  };

  const roleHandler = (e) => {
    setRole(e.target.value);
    setUserRoleValid(true);
    setErrorMessage("");
  };

  const requrementsChecker = () => {
    if (reqNotMetShown) {
      if (!firstNameValid) {
        return "First name must be at least 2 characters long";
      } else if (!lastNameValid) {
        return "Last name must be at least 2 characters";
      } else if (!emailValid) {
        return "Email is not valid";
      } else if (!usernameValid) {
        return "Username is not valid";
      } else if (!usernameAvailable) {
        return "Username already in use";
      } else if (!passwordValid) {
        return "Password needs to be at least 4 characters long";
      } else if (!confirmPasswordValid) {
        return "Passwords do not match";
      }
    } else {
      console.log("else");
      return;
    }
  };

  return (
    <div style={{ backgroundColor: "#ddd", height: "100vh" }}>
      {/* {(firstNameClasses = `login-input login-input-rejected`)} */}
      <div className="login-register-container">
        <div className="login-register-image-container">
          <img className="login-register-image" src={logoMark} />
        </div>
        <div className="login-register-input-container">
          <div className="b-2 login-register-inputs">
            <div
              style={{ marginBottom: "30px", position: "relative" }}
              className="w-100"
            >
              <p
                style={{ position: "absolute", bottom: "-10px" }}
                className="b-3"
              >
                Register
              </p>
              <span className="b-1">Welcome to</span>
              <span>
                <img id="loginLogo" src={logoDark} />
              </span>
            </div>
            <div
              style={{ marginBottom: "30px" }}
              className="d-flex justify-content-between"
            >
              <div style={{ width: "45%" }}>
                <p>First name</p>
                <input
                  className={`login-input`}
                  value={firstName}
                  onChange={(e) => firstNameHandler(e)}
                  name="firstName"
                  placeholder="First name"
                ></input>
                {/* {!firstNameValid && reqNotMetShown && (
                  <p>First name not valid</p>
                )} */}
              </div>

              <div style={{ width: "45%" }}>
                <p>Last name</p>
                <input
                  className="login-input"
                  value={lastName}
                  onChange={(e) => lastNameHandler(e)}
                  name="lastName"
                  placeholder="Last name"
                ></input>
              </div>
            </div>
            {/* {!lastNameValid && reqNotMetShown && <p>Last name not valid</p>} */}
            <div
              style={{ marginBottom: "30px" }}
              className="d-flex justify-content-between"
            >
              <div style={{ width: "45%" }}>
                <p>Email</p>
                <input
                  className="login-input"
                  value={email}
                  onChange={(e) => emailHandler(e)}
                  name="email"
                  placeholder="Email"
                ></input>
                {/* {!emailValid && reqNotMetShown && <p>Email not valid</p>} */}
              </div>
              <div style={{ width: "45%" }}>
                <p>Username</p>
                <input
                  className="login-input"
                  value={username}
                  onChange={(e) => usernameHandler(e)}
                  name="username"
                  placeholder="Username"
                ></input>
                {/* {!usernameValid && reqNotMetShown && <p>Username not valid</p>} */}
              </div>

              {/* {!usernameAvailable && reqNotMetShown && (
                <p>Username already in use!</p>
              )} */}
            </div>
            <div
              style={{ marginBottom: "30px" }}
              className="d-flex justify-content-between"
            >
              <div style={{ width: "45%" }}>
                <p>Password</p>
                <input
                  className="login-input"
                  type="password"
                  value={password}
                  onChange={(e) => passwordHandler(e)}
                  name="password"
                  placeholder="Password"
                ></input>
                {/* {!passwordValid && reqNotMetShown && <p>Password not valid</p>} */}
              </div>
              <div style={{ width: "45%" }}>
                {" "}
                <p>Confirm</p>
                <input
                  className="login-input"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => confirmPasswordHandler(e)}
                  name="password"
                  placeholder="Confirm"
                ></input>
              </div>
              {/* {!confirmPasswordValid && reqNotMetShown && (
                <p>Passwords don't match</p>
              )} */}
            </div>
            <div
              style={{ marginBottom: "30px" }}
              className="d-flex justify-content-between align-items-center"
              value={role}
              onChange={(e) => roleHandler(e)}
            >
              <div style={{ flex: 1, marginRight: "20px" }}>
                <input
                  style={{ marginRight: "10px" }}
                  type="radio"
                  value="worker"
                  name="role"
                />
                <span>Worker</span>
              </div>
              <div style={{ flex: 1 }}>
                <input
                  style={{ marginRight: "10px" }}
                  type="radio"
                  value="project_manager"
                  name="role"
                />
                <span>Manager</span>
              </div>
            </div>
            {/* {!userRoleValid && reqNotMetShown && <p>Please select a role</p>} */}
            <div className="d-flex justify-content-between align-items-center">
              <span
                className="login-register-switch b-3"
                onClick={() => {
                  navigate("/login");
                }}
              >
                Already a user?
              </span>
              <button className="btn-default-g" onClick={register}>
                Register
              </button>
              {reqNotMetShown && (
                <span className="register-error b-3">{errorMessage}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
