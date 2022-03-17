import React, { useState, useEffect, useContext } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { NavLink } from "react-router-dom";
import {
  AiOutlineDashboard,
  AiOutlineFundProjectionScreen,
  AiOutlineAreaChart,
  AiOutlineCluster,
  AiOutlineDatabase,
  AiOutlinePieChart,
  AiOutlineTeam,
  AiOutlineUser,
} from "react-icons/ai";

import logo from "../../assets/images/grape-logo-light-160322.png";

import { BiBarChart } from "react-icons/bi";

import { GrProjects } from "react-icons/gr";

function Sidebar() {
  //   const [activeLink, setActiveLink] = useState("dashboard");

  return (
    <div className="sidebar">
      <div>
        <div className="logo-content">
          <img className="logo" src={logo} />
        </div>
        <GiHamburgerMenu id="hamburger" />
        <ul className="nav-list b-1">
          <li>
            <BiBarChart className="icon" />
            <NavLink
              exact
              className={(navData) =>
                navData.isActive ? "nav-active-link" : "nav-inactive-link"
              }
              to="/dashboard"
            >
              Dashboard
            </NavLink>
          </li>
          <li>
            <AiOutlineCluster className="icon" />
            <NavLink
              className={(navData) =>
                navData.isActive ? "nav-active-link" : "nav-inactive-link"
              }
              to="/projects"
            >
              Projects
            </NavLink>
          </li>
          <li>
            <AiOutlineDatabase />
            <NavLink
              exact
              className={(navData) =>
                navData.isActive ? "nav-active-link" : "nav-inactive-link"
              }
              to="/tasks"
            >
              Tasks
            </NavLink>
          </li>
          <li>
            <AiOutlineTeam className="icon" />
            <NavLink to="/users">Users</NavLink>
          </li>
        </ul>
      </div>

      <div className="sidebar-profile-container">
        <div className="sidebar-profile-img-container">
          <img src="" />
        </div>
        <div className="sidebar-profile-info">
          <div style={{ color: "white" }} className="b-2">
            John Doe
          </div>
          <div style={{ color: "white" }} className="b-3">
            Worker
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
