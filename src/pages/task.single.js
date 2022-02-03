import React, { useEffect, useState, useCallback } from "react";
import Sidebar from "../components/shared/sidebar";
import { Container, Col, Row } from "react-bootstrap";
import { useParams } from "react-router";
import * as dataHandler from "../helpers/dataHandler";

import { useDropzone } from "react-dropzone";

function TaskSingle() {
  const { id } = useParams();
  const [task, settask] = useState("");
  const [taskProgress, setTaskProgress] = useState(0);

  useEffect(() => {
    (async () => {
      const task = await dataHandler.showSingle("tasks", id);
      settask(task);

      //Calc task progress

      const done = [];
      let taskProgress = 0;
      for (let i = 0; i < task.sub_tasks.length; i++) {
        if (task.sub_tasks[i].status === "done") {
          done.push(task.sub_tasks[i]);
        }
      }
      if (done.length < 1) {
        taskProgress = 0;
      }

      taskProgress = Math.round((done.length / task.sub_tasks.length) * 100);
      setTaskProgress(taskProgress);
    })();
  }, []);

  function MyDropzone() {
    const onDrop = useCallback((acceptedFiles) => {
      // Do something with the files
    }, []);
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop,
    });

    return (
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag 'n' drop some files here, or click to select files</p>
        )}
      </div>
    );
  }

  return (
    <div className="d-flex">
      <Sidebar />
      <Container style={{ margin: "0 50px 50px 350px" }}>
        <Row>
          <p>Task</p>
          <h1>{task?.title}</h1>
          <p>{task?.status}</p>
        </Row>
        <Row>
          <Col lg={8}>
            <div>
              <h3>Description</h3>
              {task?.description}
            </div>
            <div>
              <h3>Reference Images</h3>
              <MyDropzone
                onDrop={(acceptedFiles) => console.log(acceptedFiles)}
              >
                {({ getRootProps, getInputProps }) => (
                  <section>
                    <div {...getRootProps()}>
                      <input {...getInputProps()} />
                      <p>
                        Drag 'n' drop some files here, or click to select files
                      </p>
                    </div>
                  </section>
                )}
              </MyDropzone>
            </div>
          </Col>
          <Col lg={4}>
            <div>
              <h3>Subtasks</h3>
              {task &&
                task?.sub_tasks.map((item) => {
                  return (
                    <div className="d-flex">
                      <input checked={item.status} type="checkbox"></input>
                      <p>{item.content}</p>
                    </div>
                  );
                })}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default TaskSingle;
