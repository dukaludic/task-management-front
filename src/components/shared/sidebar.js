import React from "react";
import { Link } from "react-router-dom";

function Sidebar() {
  //   const goTo = (param) => {
  //     console.log(param);
  //     location.pathname = param;
  //   };

  return (
    <div className="sidebar-wrapper">
      <h1>LOGO</h1>
      <div>
        <ul className="sidebar-list">
          <li>
            <Link to="/">Dashboard</Link>
          </li>
          <li>
            <Link to="/projects">Projects</Link>
          </li>
          <li>
            <Link to="/tasks">Tasks</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
