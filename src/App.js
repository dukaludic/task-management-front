import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Redirect,
} from "react-router-dom";

import Dashboard from "./pages/dashboard";
import Login from "./helpers/login";
import Projects from "./pages/projects";
import Tasks from "./pages/tasks";
import TaskSingle from "./pages/task.single";
import ProjectSingle from "./pages/project.single";

// import { useContext } from "react";
// // import { AuthContext } from "./context/AuthContext";
// import { globalState } from "./context/globalState";

//State
// import

function App() {
  // const globalState = useContext(globalState);
  // console.log(globalState, "===globalState");
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route exact path="/" element={<Login />}></Route>
          <Route exact path="/dashboard" element={<Dashboard />}></Route>
          <Route exact path="/projects" element={<Projects />}></Route>
          <Route exact path="/tasks" element={<Tasks />}></Route>
          <Route exact path="/task/:id" element={<TaskSingle />}></Route>
          <Route exact path="/project/:id" element={<ProjectSingle />}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
