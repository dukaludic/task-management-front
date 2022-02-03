import React, { useEffect, useState } from "react";
import QuillEditor from "../../helpers/QuillEditor";

function ProjectGeneralDiscussion(props) {
  console.log(props.comments);

  const [quillEditor, setQuillEditor] = useState("");
  const [quillFiles, setQuillFiles] = useState([]);

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

      <QuillEditor
        onEditorChange={setQuillEditor}
        onFilesChange={setQuillFiles}
      />
    </div>
  );
}

export default ProjectGeneralDiscussion;
