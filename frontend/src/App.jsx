import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import { AchievementProvider } from "./context/AchievementContext";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Questionnaire from "./pages/Questionnaire";
import Dashboard from "./pages/Dashboard";
import ChatBot from "./pages/ChatBot";
import Trading from "./pages/Trading";
import Profile from "./pages/Profile";
import Expenses from "./pages/Expenses";
import Analytics from "./pages/Analytics";
import MicroCourse from "./pages/MicroCourse";
import Homepage from "./pages/Homepage"

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasCompletedQuestionnaire, setHasCompletedQuestionnaire] =
    useState(false);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    const questionnaireCompleted = localStorage.getItem(
      "questionnaireCompleted"
    );

    setIsAuthenticated(!!token);
    setHasCompletedQuestionnaire(!!questionnaireCompleted);
  }, []);

  const PrivateRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/" />;
    }

    if (!hasCompletedQuestionnaire) {
      return <Navigate to="/questionnaire" />;
    }

    return children;
  };

  return (
    <AchievementProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route
            path="/login"
            element={<Login setIsAuthenticated={setIsAuthenticated} />}
          />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/questionnaire"
            element={
              isAuthenticated ? (
                <Questionnaire
                  setHasCompletedQuestionnaire={setHasCompletedQuestionnaire}
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/chat"
            element={
              <PrivateRoute>
                <ChatBot />
              </PrivateRoute>
            }
          />
          <Route
            path="/trading"
            element={
              <PrivateRoute>
                <Trading />
              </PrivateRoute>
            }
          />
          <Route
            path="/courses"
            element={
              <PrivateRoute>
                <MicroCourse />
              </PrivateRoute>
            }
          />
          <Route
            path="/expenses"
            element={
              <PrivateRoute>
                <Expenses />
              </PrivateRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <PrivateRoute>
                <Analytics />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Router>
    </AchievementProvider>
  );
}

export default App;
