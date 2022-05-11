import React, { useEffect, useState, useContext, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Col, Row } from "react-bootstrap";
import moment from "moment";
import * as datahandler from "../helpers/dataHandler";
import Sidebar from "../components/shared/sidebar";
import TasksList from "../components/parts/tasksList";
import ProjectTeam from "../components/parts/project.team";
import ProjectBlockers from "../components/parts/project.blockers";
import ProjectGeneralDiscussion from "../components/parts/project.general.discussion";
import CommentsSection from "../components/parts/commentsSection";
import { IoMdClose } from "react-icons/io";
import { Auth } from "../context/AuthContext";
import ProjectSingleTeamDropdown from "../components/parts/project.single.team.dropdown";
import DropdownSearch from "../components/parts/dropdownSearch";
import ProjectSingleManagerDropdown from "../components/parts/project.single.manager.dropdown";

function ProjectSingle() {
  const { _id } = useParams();
  const [project, setProject] = useState("");
  const [todo, setTodo] = useState([]);
  const [inProgress, setInProgress] = useState([]);
  const [inReview, setInReview] = useState([]);
  const [done, setDone] = useState([]);

  const [projectProgress, setProjectProgress] = useState(0);

  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);

  const authContext = useContext(Auth);

  const [assignedUsers, setAssignedUsers] = useState([]);
  const [assignMoreOpen, setAssignMoreOpen] = useState(false);
  const [assignManager, setAssignManager] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [projectManager, setProjectManager] = useState(null);
  const [projectManagers, setProjectManagers] = useState([]);
  const [workers, setWorkers] = useState([]);

  const { user } = authContext.state.data;
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const project = await datahandler.showSingle(
        "projects/single",
        _id,
        authContext
      );
      setProject(project);
      console.log(project, "===project");

      const allUsers = await datahandler.show("users/basic", authContext);
      const allProjectManagers = allUsers.filter(
        (user) => user.role === "project_manager"
      );

      const allWorkers = allUsers.filter((user) => user.role === "worker");

      const todo = project.tasks.filter((task) => task.status === "to_do");
      const inProgress = project.tasks.filter(
        (task) => task.status === "in_progress"
      );
      const inReview = project.tasks.filter(
        (task) => task.status === "in_review"
      );
      const done = project.tasks.filter((task) => task.status === "done");

      const assignedUsersRepack = [...project.assigned_users].map((user) => {
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

      const allUsersRepack = allUsers.map((user) => {
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

      setTodo(todo);
      setInProgress(inProgress);
      setInReview(inReview);
      setDone(done);

      setAllUsers(allUsersRepack);
      setAssignedUsers(assignedUsersRepack);
      setProjectManager(project.project_manager);
      setProjectManagers(allProjectManagers);
      setWorkers(workers);
    })();
  }, []);

  // useEffect(() => {
  //   console.log(project, "project");
  //   console.log("done0", done);

  //   let projectProgress = Math.round(
  //     (done.length / project.tasks.length) * 100
  //   );

  //   setProjectProgress(projectProgress);
  // }, [done]);

  const submitComment = async () => {
    const time = new Date();

    const newCommentObj = {
      user: user,
      date_time: time,
      content: newComment,
      assignment_id: project._id,
    };

    console.log(newCommentObj);

    const newCommentRes = await datahandler.create(
      "comments",
      {
        user_id: user._id,
        date_time: time,
        content: newComment,
        assignment_id: project._id,
      },
      authContext
    );

    newCommentObj._id = newCommentRes._id;

    const newCommentassignedRes = await datahandler.create(
      "commentsassigned",
      {
        assignment_id: project._id,
        comment_id: newCommentRes._id,
      },
      authContext
    );

    setComments((prevState) => [...prevState, newCommentObj]);
    setNewComment("");
  };

  const unassignUser = async (user) => {
    console.log(user, "user");
    setAssignedUsers(assignedUsers.filter((el) => el._id !== user._id));
    console.log(childData);
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

    const updatedProject = await datahandler.update(
      "projects",
      project._id,
      {
        assigned_users: assignedUsersIds,
      },
      authContext
    );
  };

  const childData = useRef();

  const deleteProject = async () => {
    const deleteProjectRes = await datahandler.deleteItem(
      "projects",
      project._id
    );
    navigate("/projects");
  };

  return (
    <div>
      <Container>
        <Row>
          <Col>
            <h1 className="h-1 main-heading">{project.title}</h1>
            <p className="b-2">Project</p>
            {/* <div
              style={{ width: "300px", marginBottom: "20px" }}
              className="progress-bar-container"
            >
              <div className="d-flex progress-bar-progress-container">
                <div className="progress-bar-whole"></div>
                <div
                  style={{ width: `${projectProgress}%` }}
                  className="progress-bar"
                ></div>
              </div>
              <span>{`${projectProgress}%`}</span>
            </div> */}
          </Col>
        </Row>
        <Row>
          <Col style={{ height: "800px" }} lg={12}>
            {project && (
              <TasksList
                projectOnly={true}
                project={project}
                todo={todo}
                inProgress={inProgress}
                inReview={inReview}
                done={done}
              />
            )}
          </Col>
        </Row>
        <Row>
          <Col>
            {user.role === "project_manager" && (
              <div
                style={{ marginTop: "30px", marginBottom: "100px" }}
                className="card-container"
              >
                <div>
                  <h3 className="h-3">Project Manager</h3>
                  {project.project_manager && (
                    <>
                      <div
                        style={{ width: "300px" }}
                        className="d-flex justify-content-between"
                      >
                        <div className="d-flex">
                          <div
                            style={{ marginRight: "20px" }}
                            className="profile-picture-default-container"
                          >
                            <img
                              className="profile-picture-default"
                              src={projectManager?.profile_picture?.file_url}
                            />
                          </div>
                          <div>
                            <p style={{ margin: "0" }} className="b-2-bold">
                              {projectManager?.name
                                ? projectManager?.name
                                : `${projectManager?.first_name} ${projectManager?.last_name}`}
                            </p>
                            <p className="b-3">
                              {projectManager?.role === "project_manager"
                                ? "Project Manager"
                                : projectManager?.role === "worker"
                                ? "Worker"
                                : ""}
                            </p>
                          </div>
                        </div>

                        {/* {item.role !== "project_manager" && (
                              <IoMdClose
                                style={{ cursor: "pointer" }}
                                onClick={() => unassignUser(item)}
                              />
                            )} */}
                      </div>
                      {!assignManager ? (
                        <button
                          className="btn-default-g"
                          onClick={() => setAssignManager(true)}
                        >
                          Assign
                        </button>
                      ) : (
                        <div className="d-flex">
                          <div style={{ width: "300px" }}>
                            <ProjectSingleManagerDropdown
                              data={allUsers}
                              setParentData={setProjectManager}
                              projectManager={projectManager}
                              ref={childData}
                              project={project}
                              type={"project"}
                            />
                          </div>
                          <button
                            className="btn-default-grey"
                            onClick={() => setAssignManager(false)}
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                      {/* <ProjectSingleTeamDropdown
                        data={projectManagers}
                        setParentData={setProjectManager}
                        assignedUsers={[projectManager]}
                        ref={childData}
                        project={project}
                        type={"project"}
                      /> */}
                    </>
                  )}
                </div>
                <div>
                  <h3 className="h-3">Team</h3>
                  {project && (
                    <>
                      {assignedUsers?.map((item) => {
                        return (
                          <div
                            style={{ width: "300px" }}
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
                      {console.log(
                        assignedUsers,
                        "assignedUsers project.single"
                      )}
                      {assignedUsers.length > 0 && assignMoreOpen && (
                        <>
                          <div style={{ width: "300px" }}>
                            <ProjectSingleTeamDropdown
                              data={allUsers}
                              setParentData={setAssignedUsers}
                              assignedUsers={assignedUsers}
                              ref={childData}
                              project={project}
                              type={"project"}
                            />
                          </div>
                          <button
                            className="btn-default-grey"
                            onClick={() => setAssignMoreOpen(false)}
                          >
                            Cancel
                          </button>
                        </>
                      )}
                      {!assignMoreOpen && (
                        <button
                          className="btn-default-g"
                          onClick={() => setAssignMoreOpen(true)}
                        >
                          Assign
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
          </Col>

          {/* <Col>
            <ProjectBlockers blockers={project?.blockers} />
          </Col> */}
        </Row>
        <Row>
          <div>
            <button
              style={{ border: "none", marginBottom: "100px" }}
              className="review-approval-red"
              onClick={deleteProject}
            >
              Cancel Project
            </button>
          </div>
        </Row>
      </Container>
    </div>
  );
}

export default ProjectSingle;
