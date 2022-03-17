import React from "react";
import moment from "moment";

function CommentsSection({
  comments,
  setComments,
  newComment,
  setNewComment,
  submitComment,
}) {
  return (
    <div>
      <h3>Comments</h3>
      {comments?.map((item) => {
        return (
          <div style={{ border: "1px solid #ddd" }}>
            <div>
              <div
                style={{
                  width: "50px",
                  height: "50px",
                  backgroundColor: "#ddd",
                }}
              >
                <img
                  className="profile-picture-default"
                  src={item.user?.profile_picture?.base_64}
                ></img>
              </div>
              <p>{`${item.user.first_name} ${item.user.last_name}`}</p>
              <p>{moment(item.date_time).fromNow()}</p>
            </div>
            <div>{item.content}</div>
          </div>
        );
      })}
      <textarea
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        style={{ width: "100%", height: "100px" }}
      ></textarea>
      <button onClick={submitComment}>Submit</button>
    </div>
  );
}

export default CommentsSection;
