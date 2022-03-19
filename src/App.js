import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

import { useContext, useState } from "react";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Redirect,
} from "react-router-dom";

import Login from "./helpers/login";
import Sidebar from "./components/shared/sidebar";

import { Auth } from "./context/AuthContext";
import Overview from "./pages/overview";
import Dashboard from "./pages/dashboard";
import Register from "./helpers/register";
import jwt_decode from "jwt-decode";

function App() {
  const authContext = useContext(Auth);
  console.log(authContext.state.data.isAuthenticated);
  const isAuthenticated = authContext.state.data.isAuthenticated;

  //Check if user is authenticated
  if (!isAuthenticated) {
    const token = localStorage.getItem("access_token");
    if (token) {
      const decoded = jwt_decode(token);
      authContext.dispatch({ type: "LOGIN", payload: decoded });
    }
  }

  return (
    <div className="App">
      <Router>
        <Routes>
          {isAuthenticated ? (
            <>
              <Route exact path="*" element={<Dashboard />} />
            </>
          ) : (
            <>
              <Route exact path="/" element={<Login />}></Route>
              <Route exact path="/register" element={<Register />}></Route>
              <Route exact path="*" element={<Login />}></Route>
            </>
          )}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
