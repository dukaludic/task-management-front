import React, { useEffect, useState, useCallback } from "react";
import Sidebar from "../components/shared/sidebar";
import { Container, Col, Row } from "react-bootstrap";
import { useParams } from "react-router";
import * as dataHandler from "../helpers/dataHandler";

import { useDropzone } from "react-dropzone";

import * as datahandler from "../helpers/dataHandler";

function TaskSingle() {
  const { id } = useParams();
  const [task, setTask] = useState("");
  const [taskProgress, setTaskProgress] = useState(0);
  const [subTasks, setSubTasks] = useState([]);
  const [addSubTaskOpen, setAddSubTaskOpen] = useState(false);
  const [subTaskContent, setSubTaskContent] = useState("");

  const calcTaskProgress = (subTasks) => {
    console.log("calcTaskProgress");
    if (subTasks.length < 1) {
      return;
    }
    const done = [];
    let taskProgress = 0;
    console.log("subTasks", subTasks);
    for (let i = 0; i < subTasks.length; i++) {
      console.log(subTasks[i].done, "subtasks[]done");
      if (subTasks[i].done) {
        done.push(subTasks[i]);
      }
    }
    console.log(done, "done");
    if (done.length < 1) {
      taskProgress = 0;
    }

    taskProgress = Math.round((done.length / subTasks.length) * 100);
    console.log(taskProgress, "taskProgress");
    setTaskProgress(taskProgress);
  };

  useEffect(() => {
    (async () => {
      const task = await dataHandler.showSingle("tasks", id);
      setTask(task);

      setSubTasks(task.sub_tasks);

      calcTaskProgress(task.sub_tasks);

      console.log(task, "TASK");
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
          <div className="dropzone-task">Drop the files here ...</div>
        ) : (
          <div className="dropzone-task">
            Drag 'n' drop some files here, or click to select files
          </div>
        )}
      </div>
    );
  }

  useEffect(() => {
    console.log("use effect");
    calcTaskProgress(subTasks);
  }, [subTasks]);

  const addSubTask = async () => {
    const subTaskObj = {
      task_id: id,
      content: subTaskContent,
      done: false,
    };

    console.log(subTaskObj, "subTaskObj");

    const createSubTaskRes = await datahandler.create("subtasks", subTaskObj);

    console.log(createSubTaskRes, "createSubTaskRes");

    subTaskObj.id = createSubTaskRes.id;

    console.log(task, "task asd");
    // calcTaskProgress(subTasks);
    setSubTasks([subTaskObj, ...subTasks]);
  };

  const subTaskCheck = (index, isChecked) => {
    console.log("subtaskchecke");
    const tmpSubTasksArr = subTasks;

    tmpSubTasksArr[index].done = !isChecked;

    console.log(tmpSubTasksArr[index], "tmpSubTasksArr");
    console.log(tmpSubTasksArr, "tmpSubTasksArr");

    setSubTasks(tmpSubTasksArr);
  };

  return (
    <div className="d-flex">
      <Container>
        <Row>
          <p>Task</p>
          <h1>{task?.title}</h1>
          {console.log(subTasks, "subTasks . lenght")}
          {subTasks?.length > 0 && <div>{taskProgress}</div>}
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
              {addSubTaskOpen && (
                <div>
                  <input
                    value={subTaskContent}
                    onChange={(e) => setSubTaskContent(e.target.value)}
                    type="text"
                    placeholder="Add an item"
                  ></input>
                  <button onClick={addSubTask}>Add</button>
                </div>
              )}
              {!addSubTaskOpen && (
                <button onClick={() => setAddSubTaskOpen(true)}>
                  Add an item
                </button>
              )}
              {console.log(subTasks[0])}
              {subTasks &&
                subTasks.map((item, index) => {
                  return (
                    <div className="d-flex">
                      <input
                        onChange={() => subTaskCheck(index, item.done)}
                        value={item.done}
                        type="checkbox"
                      ></input>
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
