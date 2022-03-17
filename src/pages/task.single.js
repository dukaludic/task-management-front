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
import * as dataHandler from "../helpers/dataHandler";
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

  const AuthContext = useContext(Auth);

  const { user } = AuthContext.state.data;

  useEffect(() => {
    (async () => {
      const task = await dataHandler.showSingle("tasks", _id);

      const fetchedProjectUsers = await datahandler.show(
        `users/project/${task.project_id}`
      );

      const uploadedImages = await datahandler.show(
        `imagesassigned/assignment_id/${_id}`
      );

      const comments = await datahandler.show(`comments/assignment_id/${_id}`);

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

      setTask(task);
      setTitle(task.title);
      setDescription(task.description);
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
          const uploadedImageRes = await datahandler.create("images", {
            base_64: data,
          });

          const createImageAssigned = await datahandler.create(
            "imagesassigned",
            { assignment_id: task._id, image_id: uploadedImageRes._id }
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
    const subTaskObj = {
      task_id: _id,
      content: subTaskContent,
      done: false,
    };

    const createSubTaskRes = await datahandler.create("subtasks", subTaskObj);

    subTaskObj._id = createSubTaskRes._id;

    // calcTaskProgress(subTasks);
    setSubTasks([subTaskObj, ...subTasks]);
  };

  const subTaskCheck = async (index, isChecked) => {
    const updateSubTaskRes = await datahandler.update(
      "subtasks",
      subTasks[index]._id,
      { done: !isChecked }
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

    const deleteSubtaskRes = datahandler.deleteItem("subtasks", _id);

    setSubTasks((prevState) => prevState.filter((el) => el._id !== _id));
  };

  const setEdit = (element, value) => {
    if (element === "title") {
      setEditTitle((prevState) => !prevState);
    } else if (element === "description") {
      setEditDescription((prevState) => !prevState);
    }
  };

  // const saveChanges = async () => {
  //   const assignedUsersIds = [];
  //   for (let i = 0; i < assignedUsers.length; i++) {
  //     assignedUsersIds.push(assignedUsers[i]._id);
  //   }

  //   const updateTaskObj = {
  //     title: title,
  //     description: description,
  //     status: status,
  //     assigned_users: assignedUsersIds,
  //   };

  //   const updateTaskRes = await datahandler.update(
  //     "tasks",
  //     task._id,
  //     updateTaskObj
  //   );

  //   console.log(updateTaskObj);

  //   // console.log(allImages, "allImages");

  //   // const notInImagesShown = allImages.filter(
  //   //   ({ _id }) => !imagesShown.some((img) => img._id === _id)
  //   // );

  //   // console.log(notInImagesShown, "notInImagesShown");

  //   // for (let i = 0; i < allImages.length; i++) {
  //   //   console.log("uploaeded");
  //   //   if (!imagesShown.some((el) => el._id === allImages[i]._id)) {
  //   //     if (allImages[i]._id.toString().length > 3) {
  //   //       const deletedImage = await datahandler.deleteItem(
  //   //         "images",
  //   //         allImages[i]._id
  //   //       );
  //   //     }
  //   //   }
  //   // }

  //   // for (let i = 0; i < allImages.length; i++) {
  //   //   // if (imagesShown[i]._id) {
  //   //   //   const deletedImage = await datahandler.deleteItem(
  //   //   //     "imagesassigned",
  //   //   //     imagesShown[index]._id
  //   //   //   );
  //   //   // }

  //   //   if (allImages[i]._id === undefined) {
  //   //     const createImageRes = await datahandler.create("images", {
  //   //       base_64: allImages[i].base_64,
  //   //     });

  //   //     const createImageassignedRes = await datahandler.create(
  //   //       "imagesassigned",
  //   //       {
  //   //         assignment_id: task._id,
  //   //         image_id: createImageRes._id,
  //   //       }
  //   //     );
  //   //   }
  //   // }
  // };

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

    const deletedImage = await datahandler.deleteItem("images", image._id);

    // console.log(index);
    // const tmpImagesShown = imagesShown;
    // tmpImagesShown.splice(index, 1);
    // console.log(tmpImagesShown, "tmpImagesShown");
    // setImagesShown(tmpImagesShown);
    // forceUpdate();
  };

  const saveTitle = async () => {
    if (task.title !== title) {
      const updatedTask = await datahandler.update("tasks", task._id, {
        title: title,
      });
    }
    const tmpTask = task;
    tmpTask.title = title;
    setTask(tmpTask);
    console.log(task, "TASK");
    setEditTitle(!editTitle);
  };

  const statusChange = async (value) => {
    if (task.status !== value) {
      const updatedTask = await datahandler.update("tasks", task._id, {
        status: value,
      });
    }
    const tmpTask = task;
    tmpTask.status = value;
    setTask(tmpTask);
    setStatus(value);
  };

  const saveDescription = async () => {
    if (task.description !== description) {
      const updatedTask = await datahandler.update("tasks", task._id, {
        description: description,
      });
    }
    const tmpTask = task;
    tmpTask.description = description;
    setTask(tmpTask);

    setEditDescription(!editDescription);
  };

  const submitComment = async () => {
    const time = new Date();

    const newCommentObj = {
      user: user,
      date_time: time,
      content: newComment,
      assignment_id: task._id,
    };

    console.log(newCommentObj);

    const newCommentRes = await datahandler.create("comments", {
      user_id: user._id,
      date_time: time,
      content: newComment,
      assignment_id: task._id,
    });

    newCommentObj._id = newCommentRes._id;

    const newCommentassignedRes = await datahandler.create("commentsassigned", {
      assignment_id: task._id,
      comment_id: newCommentRes._id,
    });

    setComments((prevState) => [...prevState, newCommentObj]);
    setNewComment("");
  };

  return (
    <div className="d-flex">
      <Container>
        <Row>
          <Col lg={8}>
            <p>Task</p>
            <div
              onMouseEnter={() => setTitleEditIconShown(true)}
              onMouseLeave={() => setTitleEditIconShown(false)}
            >
              <span className="d-flex justify-content-between">
                {!editTitle ? (
                  <h1>{title}</h1>
                ) : (
                  <input
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}
                  />
                )}
                {titleEditIconShown ? (
                  !editTitle ? (
                    <AiFillEdit onClick={() => setEditTitle(!editTitle)} />
                  ) : (
                    <div>
                      <AiOutlineCheck onClick={saveTitle} />
                      <IoMdClose onClick={() => setEditTitle(!editTitle)} />
                    </div>
                  )
                ) : null}
              </span>
            </div>
            {subTasks?.length > 0 && <div>{taskProgress}</div>}
            {/* <p>{task?.status}</p> */}
            <select
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
              <option selected={task?.status === "in_review"} value="in_review">
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
              onMouseEnter={() => setDescriptionEditShown(true)}
              onMouseLeave={() => setDescriptionEditShown(false)}
            >
              <span className="d-flex justify-content-between">
                <h3>Description</h3>
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
            </div>
            <div>
              <h3>Team</h3>
              {assignedUsers?.map((item) => {
                return (
                  <div className="d-flex">
                    <div className="d-flex">
                      <div
                        style={{
                          width: "50px",
                          height: "50px",
                          backgroundColor: "#ddd",
                        }}
                      >
                        <img
                          className="profile-picture-default"
                          src={item?.profile_picture?.base_64}
                        />
                      </div>
                      <div>
                        <p>{`${item.name}`}</p>
                        <p>{item.role}</p>
                      </div>
                    </div>
                    <IoMdClose onClick={() => unassignUser(item)} />
                  </div>
                );
              })}
              {assignMoreOpen && (
                <TaskSingleTeamDropdown
                  data={projectUsers}
                  setParentData={setAssignedUsers}
                  assignedUsers={assignedUsers}
                  ref={childData}
                  task={task}
                />
              )}
              {!assignMoreOpen && (
                <button onClick={() => setAssignMoreOpen(true)}>
                  Assign More
                </button>
              )}
            </div>
            <div>
              <p>Images</p>
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
                          style={{ position: "absolute", cursor: "pointer" }}
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
            {/* <button onClick={saveChanges}>SAVE</button> */}
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

              {subTasks &&
                subTasks.map((item, index) => {
                  return (
                    <>
                      <div className="d-flex justify-content-between">
                        <input
                          checked={item.done}
                          onChange={(e) => subTaskCheck(index, item.done)}
                          type="checkbox"
                        ></input>
                        <IoMdClose
                          onClick={() => removeSubtask(index, item._id)}
                        />
                      </div>
                      <p>{item.content}</p>
                    </>
                  );
                })}
            </div>
          </Col>
        </Row>
        <Row>
          <Col lg={8}>
            <h3>Comments</h3>
            {comments.map((item) => {
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
          </Col>
        </Row>
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
