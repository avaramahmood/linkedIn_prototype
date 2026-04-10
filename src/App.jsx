import React, { useState, useEffect } from "react";
import Header from "./Header.jsx";
import Sidebar from "./Sidebar.jsx";
import Feed from "./Feed.jsx";
import Login from "./Login.jsx";
import Widgets from "./Widgets.jsx";
import Profile from "./pages/Profile";
import InternshipHub from "./pages/InternshipHub";
import MentorConnect from "./pages/MentorConnect";
import Collaboration from "./pages/Collaboration";
import SkillAnalysis from "./pages/SkillAnalysis";
import MyNetwork from "./pages/MyNetwork";
import { useSelector } from "react-redux";
import "./App.css";

function App() {
  const user = useSelector((state) => state.user.user);
  const isStudent = useSelector((state) => state.user.isStudent);
  const [currentPage, setCurrentPage] = useState("home");

  useEffect(() => {
    if (isStudent) {
      document.body.classList.add("student-active");
    } else {
      document.body.classList.remove("student-active");
    }
    return () => {
      document.body.classList.remove("student-active");
    };
  }, [isStudent]);

  const navigate = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const renderPage = () => {
    switch (currentPage) {
      case "profile":
        return <Profile onBack={() => navigate("home")} />;
      case "internships":
        return <InternshipHub onNavigate={navigate} />;
      case "mentors":
        return <MentorConnect onNavigate={navigate} />;
      case "home":
      default:
        return (
          <>
            <Header
              onProfileClick={() => navigate("profile")}
              currentPage={currentPage}
              onNavigate={navigate}
            />
            <div className="app__body">
              <Sidebar />
              <Feed />
              <Widgets />
            </div>
          </>
        );
    }
  };

  // For non-home pages, still show header
  const showHeaderOnPage = currentPage === "internships" || currentPage === "mentors" || currentPage === "profile" || currentPage === "collab" || currentPage === "skills" || currentPage === "network";

  return (
    <div className={`app ${isStudent ? "student-active" : ""}`}>
      {!user ? (
        <Login />
      ) : (
        <>
          {showHeaderOnPage && (
            <Header
              onProfileClick={() => navigate("profile")}
              currentPage={currentPage}
              onNavigate={navigate}
            />
          )}
          {currentPage === "home" && (
            <>
              <Header
                onProfileClick={() => navigate("profile")}
                currentPage={currentPage}
                onNavigate={navigate}
              />
              <div className="app__body">
                <Sidebar />
                <Feed />
                <Widgets />
              </div>
            </>
          )}
          {currentPage === "profile" && <Profile onBack={() => navigate("home")} />}
          {currentPage === "internships" && <InternshipHub onNavigate={navigate} />}
          {currentPage === "mentors" && <MentorConnect onNavigate={navigate} />}
          {currentPage === "collab" && <Collaboration onNavigate={navigate} />}
          {currentPage === "skills" && <SkillAnalysis onNavigate={navigate} />}
          {currentPage === "network" && <MyNetwork onNavigate={navigate} />}
        </>
      )}
    </div>
  );
}

export default App;
