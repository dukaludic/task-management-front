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

  const reviewOptionSelect = async (option, review) => {
    let newStatus;
    let approval;
    switch (option) {
      case "Resolve":
        approval = "approved";
        newStatus = "done";
        break;
      case "Send back":
        approval = "rejected";
        newStatus = "in_progress";
        break;

      default:
        break;
    }

    console.log(review, "review");

    const updatedReview = await datahandler.update("reviews", review._id, {
      approval: approval,
      reviewed_by: user._id,
      time_reviewed: new Date(),
    });

    const updatedTask = await datahandler.update("tasks", review.task._id, {
      status: newStatus,
    });

    const tmpReviewsArr = props.reviews.filter(
      (item) => item._id !== review._id
    );
    const tmpUserReviewsArr = props.userReviews.filter(
      (item) => item._id !== review._id
    );

    props.setReviews(tmpReviewsArr);
    props.setUserReviews(tmpUserReviewsArr);

    // tmpInReviewArr.splice(index, 1);
    // props.setInReview(props.inReview);
    // setInReview(props.inReview);
  };

  const removeReview = async (_id) => {
    const deletedReview = await datahandler.deleteItem("reviews", _id);

    const tmpReviewsArr = props.reviews.filter((item) => item._id !== _id);
    const tmpUserReviewsArr = props.userReviews.filter(
      (item) => item._id !== _id
    );

    props.setReviews(tmpReviewsArr);
    props.setUserReviews(tmpUserReviewsArr);

    console.log(tmpReviewsArr, "tmpReviewsArr");
  };

  return (
    <div className="main-card">
      <h3>Reviews</h3>
      {props.reviews.length === 0 && (
        <p>You currently have no pending reviews</p>
      )}
      {props.reviews.map((review) => {
        return (
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <Link to={`/task/${review.task._id}`}>
                <p>{review.task.title}</p>
              </Link>
              {(review.approval === "approved" ||
                review.approval === "rejected") && (
                <>
                  <p onClick={() => removeReview(review._id)}>X</p>
                  <p>
                    {`${review.reviewed_by.first_name} ${review.reviewed_by.last_name}`}{" "}
                    {moment(review.time_reviewed).format("MMM Do YY")}
                  </p>
                </>
              )}
              {/* <span
                style={{ fontSize: "11px" }}
              >{`${task.assigned_users[0].first_name} ${task.assigned_users[0].last_name}`}</span> */}
              <span style={{ fontSize: "11px" }}>
                {user.role === "project_manager"
                  ? moment(review.time_sent_to_review).format("MMM Do YY")
                  : moment(review.time_reviewed).format("MMM Do YY")}
              </span>
            </div>
            {user.role === "project_manager" ? (
              <Dropdown isOpen={true} toggle={toggle}>
                <Dropdown.Toggle>
                  <BsThreeDotsVertical />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item
                    onClick={(e) =>
                      reviewOptionSelect(e.target.innerHTML, review)
                    }
                  >
                    Resolve
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={(e) =>
                      reviewOptionSelect(e.target.innerHTML, review)
                    }
                  >
                    Send back
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <>
                <p>{`${review.approval}`}</p>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default DashboardReviews;
