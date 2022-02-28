import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { Auth } from "../../context/AuthContext";

function Sidebar() {
  //   const goTo = (param) => {
  //     console.log(param);
  //     location.pathname = param;
  //   };

  const context = useContext(Auth);
  const navigate = useNavigate();

  const logout = () => {
    console.log(context, "===context");
    context.dispatch({ type: "LOG_OUT" });
    navigate("/");
  };

  return (
    <div className="sidebar-wrapper">
      <h1>LOGO</h1>
      <div>
        <ul className="sidebar-list">
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/projects">Projects</Link>
          </li>
          <li>
            <Link to="/tasks">Tasks</Link>
          </li>
        </ul>
        <button onClick={logout}>Log Out</button>
      </div>
    </div>
  );
}

export default Sidebar;
