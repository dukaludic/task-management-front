import React, { useEffect, useState, useContext, useRef } from "react";
import { useParams } from "react-router-dom";
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
import TaskSingleTeamDropdown from "../components/parts/task.single.team.dropdown";

function ProjectSingle() {
  const { _id } = useParams();
  const [project, setProject] = useState("");
  const [todo, setTodo] = useState([]);
  const [inProgress, setInProgress] = useState([]);
  const [inReview, setInReview] = useState([]);
  const [done, setDone] = useState([]);

  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);

  const authContext = useContext(Auth);

  const [assignedUsers, setAssignedUsers] = useState([]);
  const [assignMoreOpen, setAssignMoreOpen] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  const { user } = authContext.state.data;

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

      const todo = project.tasks.filter((task) => task.status === "to_do");
      const inProgress = project.tasks.filter(
        (task) => task.status === "in_progress"
      );
      const inReview = project.tasks.filter(
        (task) => task.status === "in_review"
      );
      const done = project.tasks.filter((task) => task.status === "done");

      const assignedUsersRepack = [
        project.project_manager,
        ...project.assigned_users,
      ].map((user) => {
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
      console.log(
        [project.project_manager, ...project.assigned_users],
        "PROJECT USRS"
      );
      setAllUsers(allUsersRepack);
      setAssignedUsers(assignedUsersRepack);
    })();
  }, []);

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

    const updatedProject = await datahandler.update(
      "tasks",
      project._id,
      {
        assigned_users: assignedUsersIds,
      },
      authContext
    );
  };

  const childData = useRef();

  return (
    <div>
      <Container>
        <Row>
          <Col>
            <p>Project</p>
            <h1>{project?.title}</h1>
            <p>{project?.status}</p>
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
              <>
                <div>
                  <h3>Team</h3>
                  {project && (
                    <>
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

                      {allUsers.length > 0 && assignMoreOpen && (
                        <TaskSingleTeamDropdown
                          data={allUsers}
                          setParentData={setAssignedUsers}
                          assignedUsers={assignedUsers}
                          ref={childData}
                          project={project}
                        />
                      )}
                      {!assignMoreOpen && (
                        <button onClick={() => setAssignMoreOpen(true)}>
                          Assign More
                        </button>
                      )}
                    </>
                  )}
                </div>
              </>
            )}
          </Col>
          {/* <Col>
            <ProjectBlockers blockers={project?.blockers} />
          </Col> */}
        </Row>
        <Row>
          <Col>
            {/* <ProjectGeneralDiscussion comments={project?.comments} /> */}
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
    </div>
  );
}

export default ProjectSingle;
