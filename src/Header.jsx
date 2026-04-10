import React, { useState, useRef, useEffect } from "react";
import HeaderOption from "./HeaderOption.jsx";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectUser, toggleStudentMode } from "./features/userSlice";
import "./Header.css";

const HomeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

const NetworkIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const InternshipIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347"/>
    <path d="M15.75 9.319l-7.5-4.329A2.25 2.25 0 0 0 5.26 6.867l-.003.18a2.25 2.25 0 0 0 1.113 1.994l3.63 2.093"/>
    <path d="M12 3v6"/>
    <circle cx="12" cy="3" r="1.5"/>
    <path d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5"/>
  </svg>
);

const MentorIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 14l9-5-9-5-9 5 9 5z"/>
    <path d="M12 14l6.16-3.422A12.08 12.08 0 0 1 21 17.5c0 1.38-.5 2.5-2 3.5-1.5 1-4 2-7 2s-5.5-1-7-2c-1.5-1-2-2.12-2-3.5a12.08 12.08 0 0 1 2.84-6.922L12 14z"/>
    <path d="M12 14v9"/>
    <path d="M21 10v5"/>
  </svg>
);

const CollabIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="2 4 6 8 10 4"/>
  </svg>
);

const SettingsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
);

const UserIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const SkillIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
  </svg>
);

function Header({ onProfileClick, currentPage, onNavigate }) {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isStudent = useSelector((state) => state.user.isStudent);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const logoutOfApp = () => {
    setShowDropdown(false);
    dispatch(logout());
  };

  const openProfile = () => {
    setShowDropdown(false);
    if (onProfileClick) onProfileClick();
  };

  const toggleStudent = () => {
    dispatch(toggleStudentMode());
  };

  const handleNav = (page) => {
    if (onNavigate) onNavigate(page);
  };

  return (
    <header className="header">
      <div className="header__container">
        <div className="header__left">
          <img
            src="/LinkedInlogo.png"
            alt="LinkedIn"
            className="header__logo"
            onClick={() => handleNav("home")}
            style={{ cursor: "pointer" }}
          />
          <div className="header__search">
            <svg className="header__search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.5)" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input type="text" placeholder="Search" />
          </div>
        </div>
        <nav className="header__nav">
          <HeaderOption Icon={HomeIcon} title="Home" active={currentPage === "home"} onClick={() => handleNav("home")} />
          <HeaderOption Icon={NetworkIcon} title="My Network" active={currentPage === "network"} onClick={() => handleNav("network")} />
          <HeaderOption Icon={InternshipIcon} title="Internships" active={currentPage === "internships"} onClick={() => handleNav("internships")} />
          <HeaderOption Icon={MentorIcon} title="Mentors" active={currentPage === "mentors"} onClick={() => handleNav("mentors")} />
          <HeaderOption Icon={CollabIcon} title="Collab" active={currentPage === "collab"} onClick={() => handleNav("collab")} />

          <div className="header__profileDropdown" ref={dropdownRef}>
            <button
              className="headerOption"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <img
                src={user?.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || 'U')}&background=0a66c2&color=fff&size=128`}
                alt={user?.displayName || 'Me'}
                style={{ width: 24, height: 24, borderRadius: '50%', objectFit: 'cover' }}
              />
              <span className="headerOption__title">Me</span>
              <ChevronDownIcon />
            </button>

            {showDropdown && (
              <div className="header__dropdown">
                <div className="header__dropdownHeader">
                  <img
                    src={user?.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || 'U')}&background=0a66c2&color=fff&size=128`}
                    alt={user?.displayName}
                    className="header__dropdownAvatar"
                  />
                  <div>
                    <h4>{user?.displayName}</h4>
                    <p>{user?.headline || user?.email}</p>
                  </div>
                </div>
                <button className="header__dropdownItem" onClick={openProfile}>
                  <UserIcon />
                  <span>View Profile</span>
                </button>
                <button className="header__dropdownItem" onClick={() => { setShowDropdown(false); onNavigate("skills"); }}>
                  <SkillIcon />
                  <span>Skill Level</span>
                </button>
                <button className="header__dropdownItem" onClick={() => { setShowDropdown(false); dispatch(logout()); }}>
                  <SettingsIcon />
                  <span>Settings</span>
                </button>
              </div>
            )}
          </div>

          <div className="header__divider" />

          <div className="header__studentToggle">
            <span className="header__studentLabel">Student</span>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={isStudent}
                onChange={toggleStudent}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="header__work">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
              <line x1="8" y1="21" x2="16" y2="21"/>
              <line x1="12" y1="17" x2="12" y2="21"/>
            </svg>
            <span className="header__workLabel">Work</span>
            <ChevronDownIcon />
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;
