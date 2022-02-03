import React, { useEffect, useState } from "react";

function ProjectGeneralDiscussion(props) {
  console.log(props.comments);

  return (
    <div>
      <h3>General Discussion</h3>
      <hr></hr>
      {props.comments &&
        props.comments.map((comment) => {
          return (
            <div>
              <div className="d-flex">
                <div className="team-big-image-circle"></div>
                <div>
                  <span>{`${comment.user.first_name} ${comment.user.last_name}`}</span>
                  <span> 2/3/2020</span>
                </div>
              </div>
              <p style={{ marginLeft: "50px" }}>{comment.content}</p>
            </div>
          );
        })}
    </div>
  );
}

export default ProjectGeneralDiscussion;
