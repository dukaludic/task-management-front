import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import moment from "moment";

import { BsThreeDotsVertical } from "react-icons/bs";
import Dropdown from "react-bootstrap/Dropdown";

import * as datahandler from "../../helpers/dataHandler";

import { Auth } from "../../context/AuthContext";
import { AiOutlineClose } from "react-icons/ai";

function DashboardReviews(props) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [inReview, setInReview] = useState([]);
  const [reviewHovering, setReviewHovering] = useState(null);
  const authContext = useContext(Auth);
  const { user } = authContext.state.data;

  const toggle = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const reviewOptionSelect = async (option, review) => {
    let newStatus;
    let approval;
    switch (option) {
      case "Approve":
        approval = "approved";
        newStatus = "done";
        break;
      case "Reject":
        approval = "rejected";
        newStatus = "in_progress";
        break;

      default:
        break;
    }

    console.log(review, "review");

    const updatedReview = await datahandler.update(
      "reviews",
      review._id,
      {
        approval: approval,
        reviewed_by: user._id,
        time_reviewed: new Date(),
      },
      authContext
    );

    const updatedTask = await datahandler.update(
      "tasks",
      review.task._id,
      {
        status: newStatus,
      },
      authContext
    );

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

  const removeReview = async (review) => {
    console.log(review, "review");

    const deletedReview = await datahandler.deleteItem(
      "reviews",
      review._id,
      authContext
    );

    const updateTaskRes = await datahandler.update("tasks", review.task._id, {
      status: "in_progress",
      authContext,
    });

    const tmpReviewsArr = props.reviews.filter(
      (item) => item._id !== review._id
    );
    const tmpUserReviewsArr = props.userReviews.filter(
      (item) => item._id !== review._id
    );

    props.setReviews(tmpReviewsArr);
    props.setUserReviews(tmpUserReviewsArr);

    console.log(tmpReviewsArr, "tmpReviewsArr");
  };

  return (
    <div className="card-container">
      <h3 className="h-3">Reviews</h3>
      {props.reviews.length === 0 && (
        <p className="b-3">You currently have no pending reviews</p>
      )}
      <div className="all-reviews-container">
        {props.reviews.map((review, i) => {
          return (
            <div
              onMouseEnter={() => setReviewHovering(i)}
              onMouseLeave={() => setReviewHovering(null)}
              className="review-container"
            >
              <div className="d-flex flex-column justify-space-between">
                <Link to={`/task/${review.task._id}`}>
                  <p className="b-2">{review.task.title}</p>
                </Link>
                {reviewHovering === i && user.role !== "project_manager" && (
                  <AiOutlineClose
                    onClick={() => removeReview(review)}
                    className="remove-review-icon"
                  />
                )}

                {review.approval === "approved" ||
                review.approval === "rejected" ? (
                  <div>
                    <p className="b-3">
                      {`${review.reviewed_by.first_name} ${review.reviewed_by.last_name}`}{" "}
                      {moment(review.time_reviewed).format("MMM Do YY")}
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="b-3">
                      {`${review.assignee.first_name} ${review.assignee.last_name}`}{" "}
                      {moment(review.time_sent_to_review).format("MMM Do YY")}
                    </p>
                  </div>
                )}
              </div>
              {user.role === "project_manager" ? (
                <div className="">
                  <div
                    onClick={(e) =>
                      reviewOptionSelect(e.target.innerHTML, review)
                    }
                    style={{ marginBottom: "10px" }}
                    className="review-approval-green"
                  >
                    Approve
                  </div>
                  <div
                    onClick={(e) =>
                      reviewOptionSelect(e.target.innerHTML, review)
                    }
                    className="review-approval-red"
                  >
                    Reject
                  </div>
                </div>
              ) : (
                // <Dropdown isOpen={true} toggle={toggle}>
                //   <Dropdown.Toggle>
                //     <BsThreeDotsVertical />
                //   </Dropdown.Toggle>
                //   <Dropdown.Menu>
                //     <Dropdown.Item
                //       onClick={(e) =>
                //         reviewOptionSelect(e.target.innerHTML, review)
                //       }
                //     >
                //       Resolve
                //     </Dropdown.Item>
                //     <Dropdown.Item
                //       onClick={(e) =>
                //         reviewOptionSelect(e.target.innerHTML, review)
                //       }
                //     >
                //       Send back
                //     </Dropdown.Item>
                //   </Dropdown.Menu>
                // </Dropdown>
                <>
                  <p
                    className={`review-approval${
                      review.approval === "pending"
                        ? ""
                        : review.approval === "approved"
                        ? "-worker-green"
                        : "-worker-red"
                    }`}
                  >{`${review.approval}`}</p>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default DashboardReviews;
