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

//State
// import

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route exact path="/" element={<Dashboard />}></Route>
          <Route exact path="/login" element={<Login />}></Route>
          <Route exact path="/projects" element={<Projects />}></Route>
          <Route exact path="/tasks" element={<Tasks />}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
