import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import moment from "moment";

import { BsThreeDotsVertical } from "react-icons/bs";
import Dropdown from "react-bootstrap/Dropdown";

import * as datahandler from "../../helpers/dataHandler";

import { Auth } from "../../context/AuthContext";

function DashboardReviews(props) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [inReview, setInReview] = useState([]);

  const authContext = useContext(Auth);
  const { user } = authContext.state.data;

  const toggle = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const optionsClick = async (option, task) => {
    let newStatus;
    switch (option) {
      case "Resolve":
        newStatus = "done";
        break;
      case "Send back":
        newStatus = "in_progress";
        break;

      default:
        break;
    }

    console.log(user.id);

    const updatedTask = await datahandler.update("tasks", task.id, {
      status: newStatus,
      approved: true,
      approved_by: user.id,
      time_approved: new Date(),
      still_visible_to_worker: true,
    });

    const tmpInReviewArr = props.inReview;
    const index = tmpInReviewArr.findIndex((i) => i.id === task.id);

    tmpInReviewArr.splice(index, 1);
    props.setInReview(props.inReview);
    setInReview(props.inReview);
  };

  const options = ["one", "two", "three"];

  const setNotVisibleToWorker = async (id) => {
    const updatedTask = await datahandler.update("tasks", id, {
      still_visible_to_worker: false,
    });

    const tmpUserInReviewArr = props.userInReview.filter((el) => el.id !== id);
    const tmpInReviewArr = props.inReview.filter((el) => el.id !== id);

    props.setUserInReview(tmpUserInReviewArr);
    props.setInReview(tmpInReviewArr);

    console.log(tmpInReviewArr, "tmpInReviewArr");
  };

  return (
    <div className="main-card">
      <h3>Reviews</h3>
      {props.inReview.length === 0 && (
        <p>You currently have no pending reviews</p>
      )}
      {props.inReview.map((task) => {
        return (
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <Link to={`/task/${task.id}`}>
                <p>{task.title}</p>
              </Link>
              {task.approved && (
                <>
                  <p onClick={() => setNotVisibleToWorker(task.id)}>X</p>
                  <p>
                    {`${task.approved_by.first_name} ${task.approved_by.last_name}`}{" "}
                    {moment(task.time_approved).format("MMM Do YY")}
                  </p>
                </>
              )}
              <span
                style={{ fontSize: "11px" }}
              >{`${task.assigned_users[0].first_name} ${task.assigned_users[0].last_name}`}</span>
              <span style={{ fontSize: "11px" }}>
                {user.role === "project_manager"
                  ? moment(task.time_sent_to_review).format("MMM Do YY")
                  : moment(task.time_approved).format("MMM Do YY")}
              </span>
            </div>
            {user.role === "project_manager" ? (
              <Dropdown isOpen={true} toggle={toggle}>
                <Dropdown.Toggle>
                  <BsThreeDotsVertical />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item
                    onClick={(e) => optionsClick(e.target.innerHTML, task)}
                  >
                    Resolve
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={(e) => optionsClick(e.target.innerHTML, task)}
                  >
                    Send back
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <>
                <p>{`${task.approved ? `Approved` : `Pending`}`}</p>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default DashboardReviews;
