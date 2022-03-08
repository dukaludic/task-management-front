import React, { useState, useEffect, useContext } from "react";
import * as datahandler from "./dataHandler";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { Auth } from "../context/AuthContext";

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
  const [role, setRole] = useState("worker");
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

  const authContext = useContext(Auth);

  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const usernamesRes = await datahandler.show("users/usernames");
      const emailsRes = await datahandler.show("users/emails");
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
    //check requirements
    checkIfUsernameAvailable(username);
    checkIfEmailAvailable(email);
    checkEmail(email);
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

      const newUserRes = await datahandler.create("users", newUserObj);

      console.log(newUserRes, "newuserres");

      await login(username, password);

      return;
    } else {
      setReqNotMetShown(true);
      console.log("req not met");
    }
  };

  const checkIfUsernameAvailable = (username) => {
    for (let i = 0; i < usedUsernames.length; i++) {
      if (usedUsernames[i].toLowerCase() === username.toLowerCase()) {
        setUsernameAvailable(false);
        console.log("exists");
        return false;
      }
    }
    setUsernameAvailable(true);
    return true;
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
    return true;
  };

  const userTypeHandler = (e) => {
    setUserRole(e.target.value);
    console.log(e.target.value);
  };

  const firstNameHandler = (e) => {
    setFirstName(e.target.value);
    if (e.target.value.length > 2) {
      setFirstNameValid(true);
    } else {
      setFirstNameValid(false);
    }
  };

  const lastNameHandler = (e) => {
    setLastName(e.target.value);
    if (e.target.value.length > 2) {
      setLastNameValid(true);
    } else {
      setLastNameValid(false);
    }
  };

  const emailHandler = (e) => {
    setEmail(e.target.value);
    var pattern = new RegExp(
      /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
    );
    if (!pattern.test(e.target.value)) {
      console.log("Invalid email");
      setEmailValid(false);
      return false;
    }
    setEmailValid(true);
    return true;
  };

  const usernameHandler = (e) => {
    setUsername(e.target.value);
    for (let i = 0; i < usedUsernames.length; i++) {
      if (usedUsernames[i].toLowerCase() === e.target.value.toLowerCase()) {
        setUsernameAvailable(false);
        console.log("exists");
        return false;
      }
    }
    if (e.target.value.length > 3) {
      setUsernameValid(true);
    }
    setUsernameAvailable(true);
    return true;
  };

  const passwordHandler = (e) => {
    setPassword(e.target.value);
    if (e.target.value.length > 3) {
      setPasswordValid(true);
    } else {
      setPasswordValid(false);
    }
  };

  const confirmPasswordHandler = (e) => {
    setConfirmPassword(e.target.value);
    if (password === e.target.value) {
      setConfirmPasswordValid(true);
    } else {
      setConfirmPasswordValid(false);
    }
  };

  const roleHandler = (e) => {
    setRole(e.target.value);
    setUserRoleValid(true);
  };

  return (
    <div style={{ backgroundColor: "#ddd", height: "100vh" }}>
      <div className="register-wrapper">
        <h1>Register</h1>
        <p>First Name</p>
        <input
          value={firstName}
          onChange={(e) => firstNameHandler(e)}
          name="firstName"
        ></input>
        {!firstNameValid && reqNotMetShown && <p>First name not valid</p>}
        <p>Last Name</p>
        <input
          value={lastName}
          onChange={(e) => lastNameHandler(e)}
          name="lastName"
        ></input>
        {!lastNameValid && reqNotMetShown && <p>Last name not valid</p>}
        <p>Email</p>
        <input
          value={email}
          onChange={(e) => emailHandler(e)}
          name="email"
        ></input>
        {!emailValid && reqNotMetShown && <p>Email not valid</p>}

        <p>Username</p>
        <input
          value={username}
          onChange={(e) => usernameHandler(e)}
          name="username"
        ></input>
        {!usernameValid && reqNotMetShown && <p>Username not valid</p>}

        {!usernameAvailable && reqNotMetShown && (
          <p>Username already in use!</p>
        )}
        {console.log(username, "username jsx")}
        <p>Password</p>
        <input
          type="password"
          value={password}
          onChange={(e) => passwordHandler(e)}
          name="password"
        ></input>
        {!passwordValid && reqNotMetShown && <p>Password not valid</p>}
        <p>Confirm Password</p>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => confirmPasswordHandler(e)}
          name="password"
        ></input>
        {!confirmPasswordValid && reqNotMetShown && (
          <p>Passwords don't match</p>
        )}
        <div value={role} onChange={(e) => roleHandler(e)}>
          <input type="radio" value="worker" name="role" /> Worker
          <input type="radio" value="project_manager" name="role" /> Project
          Manager
        </div>
        {!userRoleValid && reqNotMetShown && <p>Please select a role</p>}
        <button onClick={register}>Register</button>
      </div>
    </div>
  );
};

export default Login;
