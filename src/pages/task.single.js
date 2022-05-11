import React, {
  useEffect,
  useState,
  useCallback,
  useContext,
  useRef,
} from "react";
import Sidebar from "../components/shared/sidebar";
import { Container, Col, Row } from "react-bootstrap";
import { useParams } from "react-router";
import { AiFillEdit, AiOutlineCheck } from "react-icons/ai";
import { IoMdClose } from "react-icons/io";
import Modal from "react-modal";

import { useDropzone } from "react-dropzone";
import moment from "moment";

import * as datahandler from "../helpers/dataHandler";
import DropdownSearch from "../components/parts/dropdownSearch";
import TaskSingleTeamDropdown from "../components/parts/task.single.team.dropdown";
import { Auth } from "../context/AuthContext";

Modal.setAppElement("#root");

function TaskSingle() {
  const { _id } = useParams();
  const [task, setTask] = useState("");
  const [taskProgress, setTaskProgress] = useState(0);
  const [subTasks, setSubTasks] = useState([]);
  const [addSubTaskOpen, setAddSubTaskOpen] = useState(false);
  const [subTaskContent, setSubTaskContent] = useState("");
  const [descriptionEditIconShown, setDescriptionEditShown] = useState(false);
  const [editDescription, setEditDescription] = useState(false);
  const [titleEditIconShown, setTitleEditIconShown] = useState(false);
  const [editTitle, setEditTitle] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploadedImages, setUploadedImages] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalImage, setModalImage] = useState("");
  const [status, setStatus] = useState("");
  const [assignMoreOpen, setAssignMoreOpen] = useState(false);
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [projectUsers, setProjectUsers] = useState([]);
  const [hoveringOverImage, setHoveringOverImage] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);
  const [dueDate, setDueDate] = useState(null);
  const [editDueDate, setEditDueDate] = useState(false);
  const [dueDateIconShown, setDueDateIconShown] = useState(false);
  const [relationshipToDeadline, setRelationShipToDeadline] = useState(null);

  //Initiall data
  const [initialTitle, setInitialTitle] = useState("");
  const [initialDescription, setInitialDescription] = useState("");

  const [user, setUser] = useState({});

  const [, updateState] = useState();
  const forceUpdate = useCallback(() => updateState({}), []);

  const calcTaskProgress = (subTasks) => {
    if (subTasks.length < 1) {
      return;
    }
    const done = [];
    let taskProgress = 0;

    for (let i = 0; i < subTasks.length; i++) {
      if (subTasks[i].done) {
        done.push(subTasks[i]);
      }
    }

    if (done.length < 1) {
      taskProgress = 0;
    }

    taskProgress = Math.round((done.length / subTasks.length) * 100);

    setTaskProgress(taskProgress);
  };

  const authContext = useContext(Auth);

  // let { user } = authContext.state.data;

  useEffect(() => {
    calcRelationshipToDeadline();
  }, [task, relationshipToDeadline, dueDate]);

  const calcRelationshipToDeadline = () => {
    console.log("calcRelationshipToDeadline");
    let today = Date.parse(new Date());
    let inSevenDays = Date.parse(
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    );
    const dueDate = Date.parse(task?.due_date);
    console.log(dueDate, "dueDate");
    if (dueDate < today) {
      console.log("dueDate < today");
      console.log(dueDate, "dueDate");
      console.log(today, "today");
      setRelationShipToDeadline("OVERDUE");
    } else if (dueDate < inSevenDays) {
      console.log(dueDate, "dueDate < inSevenDays");
      setRelationShipToDeadline("NEAR");
    }
  };

  useEffect(() => {
    (async () => {
      const user = await datahandler.show(
        `users/basic/${authContext.state.data.user._id}`
      );

      const task = await datahandler.showSingle("tasks", _id);

      const fetchedProjectUsers = await datahandler.show(
        `users/project/${task.project_id}`,
        authContext
      );

      const uploadedImages = await datahandler.show(
        `imagesassigned/assignment_id/${_id}`,
        authContext
      );

      const comments = await datahandler.show(
        `comments/assignment_id/${_id}`,
        authContext
      );

      comments.sort((a, b) => (b.date_time > a.date_time ? 1 : -1));

      console.log(uploadedImages, "upload");

      const projectUsers = fetchedProjectUsers.map((user) => {
        return {
          _id: user._id,
          name: `${user.first_name} ${user.last_name}`,
          role: user.role,
          username: user.username,
          email: user.email,
          role: user.role,
          profile_picture: user.profile_picture,
        };
      });

      const assignedUsers = task.assigned_users.map((user) => {
        return {
          _id: user._id,
          name: `${user.first_name} ${user.last_name}`,
          role: user.role,
          username: user.username,
          email: user.email,
          role: user.role,
          profile_picture: user.profile_picture,
        };
      });

      //Shallow copy an object not to be passed as reference
      const imagesShown = uploadedImages.map((image) => {
        return {
          _id: image._id,
          base_64: image.base_64,
        };
      });

      console.log(imagesShown, "IMAGESSHOW");

      console.log(projectUsers, "projectUsers");

      setUser(user);
      setTask(task);
      setTitle(task.title);
      setInitialTitle(task.title);
      setDescription(task.description);
      setInitialDescription(task.description);
      setSubTasks(task.sub_tasks);
      calcTaskProgress(task.sub_tasks);
      setAssignedUsers(assignedUsers);
      setComments(comments);
      setProjectUsers(projectUsers);
      setUploadedImages(uploadedImages);
    })();
  }, []);

  const getBase64 = (file) => {
    return new Promise((resolve) => {
      let fileInfo;
      let baseURL = "";
      //Make new filereader
      let reader = new FileReader();

      reader.readAsDataURL(file);

      reader.onload = () => {
        baseURL = reader.result;
        resolve(baseURL);
      };
    });
  };

  useEffect(() => {
    console.log(uploadedImages, "uploadedImages");
  }, [uploadedImages]);

  function MyDropzone() {
    const onDrop = useCallback((acceptedFiles) => {
      acceptedFiles.forEach((file) => {
        getBase64(file).then(async (data) => {
          const uploadedImageRes = await datahandler.create(
            "images",
            {
              base_64: data,
            },
            authContext
          );

          const createImageAssigned = await datahandler.create(
            "imagesassigned",
            { assignment_id: task._id, image_id: uploadedImageRes._id },
            authContext
          );

          setUploadedImages((prevState) => [
            ...prevState,
            { _id: uploadedImageRes._id, base_64: data },
          ]);
        });
      });
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

  // Calculate progress on every sub task edit
  useEffect(() => {
    calcTaskProgress(subTasks);
  }, [subTasks]);

  const addSubTask = async () => {
    if (subTaskContent.length < 1) {
      return;
    }

    const subTaskObj = {
      task_id: _id,
      content: subTaskContent,
      done: false,
    };

    const createSubTaskRes = await datahandler.create(
      "subtasks",
      subTaskObj,
      authContext
    );

    subTaskObj._id = createSubTaskRes._id;

    // calcTaskProgress(subTasks);
    setSubTasks([subTaskObj, ...subTasks]);
    setSubTaskContent("");
  };

  const subTaskCheck = async (index, isChecked) => {
    const updateSubTaskRes = await datahandler.update(
      "subtasks",
      subTasks[index]._id,
      { done: !isChecked },
      authContext
    );

    const tmpSubTasksArr = [...subTasks];
    tmpSubTasksArr[index].done = !isChecked;
    console.log(tmpSubTasksArr[index], "index");

    console.log(isChecked, "isChecked");
    console.log(tmpSubTasksArr, "subTasks");

    setSubTasks(tmpSubTasksArr);
  };

  const removeSubtask = (index, _id) => {
    console.log(index, _id);

    const deleteSubtaskRes = datahandler.deleteItem(
      "subtasks",
      _id,
      authContext
    );

    setSubTasks((prevState) => prevState.filter((el) => el._id !== _id));
  };

  const setEdit = (element, value) => {
    if (element === "title") {
      setEditTitle((prevState) => !prevState);
    } else if (element === "description") {
      setEditDescription((prevState) => !prevState);
    }
  };

  const unassignUser = async (user) => {
    setAssignedUsers(assignedUsers.filter((el) => el._id !== user._id));
    childData.current.setData((prevState) => [...prevState, user]);

    const assignedUsersIds = [];
    for (let i = 0; i < assignedUsers.length; i++) {
      if (assignedUsers[i]._id === user._id) {
        continue;
      } else {
        assignedUsersIds.push(assignedUsers[i]._id);
      }
    }

    console.log(assignedUsersIds, "assignedUsersIds");

    const updatedTask = await datahandler.update("tasks", task._id, {
      assigned_users: assignedUsersIds,
    });
  };

  function openModal(image) {
    setModalIsOpen(true);
    setModalImage(image.base_64);
  }

  function closeModal() {
    setModalIsOpen(false);
  }

  const childData = useRef();

  const removeImage = async (image) => {
    setUploadedImages((prevState) =>
      prevState.filter((el) => el._id !== image._id)
    );

    const deletedImage = await datahandler.deleteItem(
      "images",
      image._id,
      authContext
    );

    // console.log(index);
    // const tmpImagesShown = imagesShown;
    // tmpImagesShown.splice(index, 1);
    // console.log(tmpImagesShown, "tmpImagesShown");
    // setImagesShown(tmpImagesShown);
    // forceUpdate();
  };

  const saveTitle = async () => {
    if (task.title !== title) {
      const updatedTask = await datahandler.update(
        "tasks",
        task._id,
        {
          title: title,
        },
        authContext
      );
    }
    const tmpTask = task;
    tmpTask.title = title;
    setTask(tmpTask);
    console.log(task, "TASK");
    setEditTitle(!editTitle);
  };

  const openEditTitle = () => {
    setEditTitle(!editTitle);
    // titleInputRef.current.focus();
    // const { current } = titleInputRef;
    // console.log(current);
  };

  const closeEditTitle = () => {
    setEditTitle(!editTitle);
    setTitle(initialTitle);
  };

  const statusChange = async (value) => {
    if (task.status !== value) {
      const updatedTask = await datahandler.update(
        "tasks",
        task._id,
        {
          status: value,
        },
        authContext
      );
    }
    const tmpTask = task;
    tmpTask.status = value;
    setTask(tmpTask);
    setStatus(value);
  };

  const saveDescription = async () => {
    if (task.description !== description) {
      const updatedTask = await datahandler.update(
        "tasks",
        task._id,
        {
          description: description,
        },
        authContext
      );
    }
    const tmpTask = task;
    tmpTask.description = description;
    setTask(tmpTask);

    setEditDescription(!editDescription);
  };

  const saveDueDate = async () => {
    if (task.due_date !== dueDate) {
      const updatedTask = await datahandler.update(
        "tasks",
        task._id,
        {
          due_date: dueDate,
        },
        authContext
      );
    }
    const tmpTask = task;
    tmpTask.due_date = dueDate;
    setTask(tmpTask);
    calcRelationshipToDeadline();
    setEditDueDate(!editDueDate);
  };

  // //fetch user info after leaving a comment
  // useEffect(() => {

  // },[comments])

  const submitComment = async () => {
    const time = new Date();

    console.log(user);

    const newCommentObj = {
      user: user,
      date_time: time,
      content: newComment,
      assignment_id: task._id,
    };

    console.log(newCommentObj);

    const newCommentRes = await datahandler.create(
      "comments",
      {
        user_id: user._id,
        date_time: time,
        content: newComment,
        assignment_id: task._id,
      },
      authContext
    );

    newCommentObj._id = newCommentRes._id;

    const newCommentassignedRes = await datahandler.create(
      "commentsassigned",
      {
        assignment_id: task._id,
        comment_id: newCommentRes._id,
      },
      authContext
    );

    setComments((prevState) => [newCommentObj, ...prevState]);
    setNewComment("");
  };

  const titleInputRef = useRef();

  return (
    <div className="d-flex">
      <Container>
        <p className="h-1 main-heading">Task Details</p>
        <div className="card-container">
          <Row>
            <Col lg={8}>
              <div
                className="task-edit-title-container"
                onMouseEnter={() => setTitleEditIconShown(true)}
                onMouseLeave={() => setTitleEditIconShown(false)}
              >
                <span className="d-flex justify-content-between">
                  {!editTitle ? (
                    <h1 className="h-1">{title}</h1>
                  ) : (
                    <input
                      ref={titleInputRef}
                      className="h-1 task-single-input"
                      onChange={(e) => setTitle(e.target.value)}
                      value={title}
                    />
                  )}
                  <div>
                    {titleEditIconShown ? (
                      !editTitle ? (
                        <AiFillEdit onClick={() => openEditTitle()} />
                      ) : (
                        <div className="task-edit-title-icons">
                          <AiOutlineCheck onClick={saveTitle} />
                          <IoMdClose onClick={() => closeEditTitle()} />
                        </div>
                      )
                    ) : null}
                  </div>
                </span>
              </div>
              <div className="progress-bar-container">
                <div className="d-flex progress-bar-progress-container">
                  <div className="progress-bar-whole"></div>
                  <div
                    style={{ width: `${taskProgress}%` }}
                    className="progress-bar"
                  ></div>
                </div>
                <span>{`${taskProgress}%`}</span>
              </div>
              <div className="d-flex flex-column">
                {/* <p>{task?.status}</p> */}
                <div className="d-flex">
                  <div
                    className="task-duedate-edit-container"
                    onMouseEnter={() => {
                      setDueDateIconShown(true);
                      console.log(dueDateIconShown);
                    }}
                    onMouseLeave={() => setDueDateIconShown(false)}
                  >
                    <span style={{ marginRight: "20px" }} className="b-2-bold">
                      Due Date
                    </span>
                    {!editDueDate ? (
                      <span>{moment(task?.due_date).format("MMM Do YY")}</span>
                    ) : (
                      <input
                        style={{ display: "inline" }}
                        type="text"
                        placeholder={moment(task?.due_date).format("MMM Do YY")}
                        onFocus={(e) => (e.target.type = "date")}
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                      ></input>
                    )}
                    <div className="task-duedate-edit-icons">
                      {dueDateIconShown ? (
                        !editDueDate ? (
                          <AiFillEdit
                            onClick={() => setEditDueDate(!editDueDate)}
                          />
                        ) : (
                          <>
                            <AiOutlineCheck onClick={saveDueDate} />
                            <IoMdClose
                              onClick={() => setEditDueDate(!editDueDate)}
                            />
                          </>
                        )
                      ) : null}
                    </div>
                  </div>
                </div>
                {console.log(
                  relationshipToDeadline,
                  "relationshipToDeadline JSX"
                )}
                {task?.status !== "done" && (
                  <div
                    style={{ fontSize: "11px", marginBottom: "20px" }}
                    className={`task-flag${
                      relationshipToDeadline === "OVERDUE"
                        ? "-r"
                        : relationshipToDeadline === "NEAR"
                        ? "-o"
                        : ""
                    }`}
                  >
                    {relationshipToDeadline}
                  </div>
                )}
              </div>
              <select
                className="task-status-select"
                onChange={(e) => statusChange(e.target.value)}
                name="status"
                _id="status"
              >
                <option value="to_do" selected={task?.status === "to_do"}>
                  To do
                </option>
                <option
                  selected={task?.status === "in_progress"}
                  value="in_progress"
                >
                  In Progress
                </option>
                <option
                  selected={task?.status === "in_review"}
                  value="in_review"
                >
                  In Review
                </option>
                <option selected={task?.status === "done"} value="done">
                  Done
                </option>
              </select>
            </Col>
          </Row>
          <Row>
            <Col lg={8}>
              <div
                className="task-description-edit-container mt-5"
                onMouseEnter={() => setDescriptionEditShown(true)}
                onMouseLeave={() => setDescriptionEditShown(false)}
              >
                <span className="d-flex justify-content-between">
                  <h3 className="h-3">Description</h3>
                </span>
                {!editDescription ? (
                  <p>{task?.description}</p>
                ) : (
                  <textarea
                    style={{ width: "100%" }}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                )}
                <div className="task-description-edit-icons">
                  {descriptionEditIconShown ? (
                    !editDescription ? (
                      <AiFillEdit
                        onClick={() => setEditDescription(!editDescription)}
                      />
                    ) : (
                      <>
                        <AiOutlineCheck onClick={saveDescription} />
                        <IoMdClose
                          onClick={() => setEditDescription(!editDescription)}
                        />
                      </>
                    )
                  ) : null}
                </div>
              </div>
              <div>
                <p style={{ marginTop: "20px" }} className="h-3">
                  Images
                </p>
                <div className="d-flex">
                  {uploadedImages.map((item, index) => {
                    return (
                      <div
                        onMouseEnter={() => {
                          setHoveringOverImage(index);
                        }}
                        onMouseLeave={() => {
                          setHoveringOverImage(null);
                        }}
                        className="task-img-container"
                      >
                        {hoveringOverImage === index && (
                          <IoMdClose
                            onClick={() => removeImage(item)}
                            style={{
                              position: "absolute",
                              top: "0",
                              right: "0",
                              cursor: "pointer",
                            }}
                          />
                        )}
                        <img
                          onClick={() => openModal(item)}
                          className="task-images"
                          src={item.base_64}
                        />
                      </div>
                    );
                  })}

                  <MyDropzone
                    onDrop={(acceptedFiles) => console.log(acceptedFiles)}
                  >
                    {({ getRootProps, getInputProps }) => (
                      <section>
                        <div {...getRootProps()}>
                          <input {...getInputProps()} />
                          <p>
                            Drag 'n' drop some files here, or click to select
                            files
                          </p>
                        </div>
                      </section>
                    )}
                  </MyDropzone>
                </div>
              </div>
              <div>
                <h3 className="h-3">Team</h3>
                {assignedUsers?.map((item) => {
                  return (
                    <div
                      style={{ width: "50%" }}
                      className="d-flex justify-content-between"
                    >
                      <div className="d-flex">
                        <div
                          style={{ marginRight: "20px" }}
                          className="profile-picture-default-container"
                        >
                          <img
                            className="profile-picture-default"
                            src={item?.profile_picture?.file_url}
                          />
                        </div>
                        <div>
                          <p
                            style={{ margin: "0" }}
                            className="b-2-bold"
                          >{`${item.name}`}</p>
                          <p className="b-3">
                            {item.role === "project_manager"
                              ? "Project Manager"
                              : item.role === "worker"
                              ? "Worker"
                              : ""}
                          </p>
                        </div>
                      </div>
                      {item.role !== "project_manager" && (
                        <IoMdClose
                          style={{ cursor: "pointer" }}
                          onClick={() => unassignUser(item)}
                        />
                      )}
                    </div>
                  );
                })}
                {assignMoreOpen && (
                  <div className="d-flex">
                    <TaskSingleTeamDropdown
                      data={projectUsers}
                      setParentData={setAssignedUsers}
                      assignedUsers={assignedUsers}
                      ref={childData}
                      task={task}
                    />
                    <button
                      style={{ marginLeft: "20px" }}
                      className="btn-default-grey mb-4"
                      onClick={() => setAssignMoreOpen(false)}
                    >
                      Cancel
                    </button>
                  </div>
                )}
                {!assignMoreOpen && (
                  <button
                    className="btn-default-g mb-4"
                    onClick={() => setAssignMoreOpen(true)}
                  >
                    Assign More
                  </button>
                )}
              </div>

              {/* <button onClick={saveChanges}>SAVE</button> */}
            </Col>
            <Col lg={4}>
              <div>
                <h3 className="h-3">Subtasks</h3>
                {addSubTaskOpen && (
                  <div className="subtask-open-container">
                    <input
                      value={subTaskContent}
                      onChange={(e) => setSubTaskContent(e.target.value)}
                      type="text"
                      placeholder="Add an item"
                    ></input>
                    <button className="btn-default-g mb-4" onClick={addSubTask}>
                      Add
                    </button>
                    <IoMdClose
                      className="subtask-open-cancel"
                      onClick={() => setAddSubTaskOpen(false)}
                    />
                  </div>
                )}
                {!addSubTaskOpen && (
                  <>
                    <button
                      className="btn-default-g mb-4"
                      onClick={() => setAddSubTaskOpen(true)}
                    >
                      Add an item
                    </button>
                  </>
                )}

                {subTasks &&
                  subTasks.map((item, index) => {
                    return (
                      <>
                        <div className="d-flex align-items-center justify-content-between">
                          <input
                            checked={item.done}
                            onChange={(e) => subTaskCheck(index, item.done)}
                            type="checkbox"
                          ></input>
                          <div style={{ marginLeft: "20px" }} className="w-100">
                            <span>{item.content}</span>
                          </div>
                          <IoMdClose
                            style={{ cursor: "pointer" }}
                            onClick={() => removeSubtask(index, item._id)}
                          />
                        </div>
                      </>
                    );
                  })}
              </div>
            </Col>
          </Row>
          <Row>
            <Col lg={8}>
              <h3 className="h-3">Comments</h3>
              <textarea
                className="comment-textarea"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                style={{ width: "100%", height: "100px" }}
              ></textarea>
              <button className="btn-default-g mb-4" onClick={submitComment}>
                Submit
              </button>
              {comments.map((item) => {
                return (
                  <>
                    <div className="comment-container b-2">
                      <div className="profile-picture-default-container">
                        <img
                          className="profile-picture-default"
                          src={item.user?.profile_picture?.file_url}
                        ></img>
                      </div>
                      <div className="comment-content-container">
                        <div>
                          <span className="b-2-bold">{`${item.user.first_name} ${item.user.last_name}`}</span>
                          <span style={{ marginLeft: "20px" }}>
                            {moment(item.date_time).fromNow()}
                          </span>
                        </div>
                        <div>
                          <p>{item.content}</p>
                        </div>
                      </div>
                    </div>
                  </>
                );
              })}
            </Col>
          </Row>
        </div>
      </Container>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Example Modal"
      >
        <img src={modalImage} />
      </Modal>
    </div>
  );
}

export default TaskSingle;
