import React, { useState } from "react";
import "./Sidebar.css";
import { Avatar } from "@material-ui/core";
import { useSelector } from "react-redux";
import { selectUser } from "./features/userSlice";

// SVG Icons (no emojis)
const ExplorerIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
  </svg>
);

const BuilderIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
  </svg>
);

const AchieverIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

const LeaderIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const TrailblazerIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
    <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/>
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
  </svg>
);

const LockIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const FolderIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
  </svg>
);

const SwordIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14.5 17.5L3 6V3h3l11.5 11.5"/>
    <path d="M13 19l6-6"/>
    <path d="M16 16l4 4"/>
    <path d="M19 21l2-2"/>
  </svg>
);

const FireIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
  </svg>
);

const BulbIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 18h6"/>
    <path d="M10 22h4"/>
    <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/>
  </svg>
);

const HandshakeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M11 17a4 4 0 0 0 8 0c0-2.28-2-4-4-4s-4 1.72-4 4z"/>
    <path d="M7 17a4 4 0 0 1 4-4c2 0 4 1.72 4 4"/>
    <path d="M11 7l4-4 4 4"/>
    <path d="M3 11l4-4 4 4"/>
    <path d="M7 3L3 7"/>
    <path d="M21 13l-4 4"/>
  </svg>
);

const LEVELS = [
  { name: "Explorer", minXP: 0, Icon: ExplorerIcon },
  { name: "Builder", minXP: 500, Icon: BuilderIcon },
  { name: "Achiever", minXP: 1500, Icon: AchieverIcon },
  { name: "Leader", minXP: 3000, Icon: LeaderIcon },
  { name: "Trailblazer", minXP: 5000, Icon: TrailblazerIcon },
];

const BADGES = [
  { id: "first-project", name: "First Project", Icon: FolderIcon, earned: true, desc: "Upload your first project" },
  { id: "app-warrior", name: "Application Warrior", Icon: SwordIcon, earned: true, desc: "Apply to 5 internships" },
  { id: "streak-30", name: "30-Day Streak", Icon: FireIcon, earned: false, desc: "Log in 30 days in a row" },
  { id: "mentor-star", name: "Mentor Star", Icon: BulbIcon, earned: false, desc: "Attend 3 mentor sessions" },
  { id: "collab-king", name: "Team Player", Icon: HandshakeIcon, earned: true, desc: "Join a collaboration project" },
];

const XP_HISTORY = [
  { action: "Uploaded project", xp: 150, time: "2h ago" },
  { action: "Applied to internship", xp: 50, time: "5h ago" },
  { action: "Completed course", xp: 200, time: "1d ago" },
  { action: "Attended mentor session", xp: 100, time: "2d ago" },
];

function getLevel(xp) {
  let level = LEVELS[0];
  for (const l of LEVELS) {
    if (xp >= l.minXP) level = l;
  }
  return level;
}

function getNextLevel(xp) {
  for (const l of LEVELS) {
    if (xp < l.minXP) return l;
  }
  return null;
}

function Sidebar() {
  const user = useSelector(selectUser);
  const [totalXP] = useState(2340);
  const [showBadgeTooltip, setShowBadgeTooltip] = useState(null);

  const currentLevel = getLevel(totalXP);
  const nextLevel = getNextLevel(totalXP);
  const progressPercent = nextLevel
    ? ((totalXP - currentLevel.minXP) / (nextLevel.minXP - currentLevel.minXP)) * 100
    : 100;

  return (
    <div className="sidebar">
      <div className="sidebar__card">
        <div className="sidebar__profile">
          <div className="sidebar__profile-bg" />
          <Avatar
            src={user?.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || 'User')}&background=0a66c2&color=fff`}
            className="sidebar__avatar"
          />
          <h2 className="sidebar__name">{user?.displayName || 'User'}</h2>
          <p className="sidebar__headline">{user?.email || 'Welcome to LinkedIn'}</p>
        </div>
        <div className="sidebar__stats">
          <div className="sidebar__stat">
            <span className="sidebar__statLabel">Who viewed your profile</span>
            <span className="sidebar__statValue">1,234</span>
          </div>
          <div className="sidebar__stat">
            <span className="sidebar__statLabel">Views of your posts</span>
            <span className="sidebar__statValue">5,678</span>
          </div>
        </div>
      </div>

      {/* ===== GAMIFICATION CARD ===== */}
      <div className="sidebar__card sidebar__gamification">
        <div className="sidebar__xpHeader">
          <div className="sidebar__levelBadge">
            <span className="sidebar__levelIcon"><currentLevel.Icon /></span>
            <div className="sidebar__levelInfo">
              <span className="sidebar__levelName">{currentLevel.name}</span>
              <span className="sidebar__xpCount">{totalXP.toLocaleString()} XP</span>
            </div>
          </div>
          {nextLevel && (
            <span className="sidebar__nextLevel">
              <nextLevel.Icon /> {nextLevel.name}
            </span>
          )}
        </div>

        <div className="sidebar__xpBarWrap">
          <div className="sidebar__xpBar">
            <div className="sidebar__xpBarFill" style={{ width: `${progressPercent}%` }} />
          </div>
          <div className="sidebar__xpBarLabels">
            <span>{currentLevel.minXP} XP</span>
            {nextLevel && <span>{nextLevel.minXP} XP</span>}
          </div>
        </div>

        <div className="sidebar__badgesSection">
          <h4 className="sidebar__sectionTitle">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="8" r="6"/>
              <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
            </svg>
            Badges
          </h4>
          <div className="sidebar__badges">
            {BADGES.map((badge) => (
              <div
                key={badge.id}
                className={`sidebar__badge ${badge.earned ? "earned" : "locked"}`}
                onMouseEnter={() => setShowBadgeTooltip(badge.id)}
                onMouseLeave={() => setShowBadgeTooltip(null)}
              >
                <span className="sidebar__badgeIcon"><badge.Icon /></span>
                {showBadgeTooltip === badge.id && (
                  <div className="sidebar__badgeTooltip">
                    <strong>{badge.name}</strong>
                    <span>{badge.desc}</span>
                    {!badge.earned && (
                      <span className="sidebar__badgeLocked">
                        <LockIcon /> Not yet earned
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="sidebar__xpHistory">
          <h4 className="sidebar__sectionTitle">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
              <polyline points="16 7 22 7 22 13"/>
            </svg>
            Recent XP
          </h4>
          {XP_HISTORY.map((item, i) => (
            <div key={i} className="sidebar__xpItem">
              <div className="sidebar__xpItemInfo">
                <span className="sidebar__xpAction">{item.action}</span>
                <span className="sidebar__xpTime">{item.time}</span>
              </div>
              <span className="sidebar__xpGain">+{item.xp} XP</span>
            </div>
          ))}
        </div>
      </div>

      <div className="sidebar__card">
        <div className="sidebar__cardTitle">
          Recent
          <span>See all</span>
        </div>
        <div className="sidebar__recentItem">
          <span className="sidebar__hash">#</span>
          <span>reactjs</span>
        </div>
        <div className="sidebar__recentItem">
          <span className="sidebar__hash">#</span>
          <span>softwareengineering</span>
        </div>
        <div className="sidebar__recentItem">
          <span className="sidebar__hash">#</span>
          <span>webdevelopment</span>
        </div>
        <div className="sidebar__recentItem">
          <span className="sidebar__hash">#</span>
          <span>programming</span>
        </div>
      </div>

      <div className="sidebar__card sidebar__discover">
        <div className="sidebar__discoverTitle">Discover</div>
        <div className="sidebar__discoverItem">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M16,11.5A1.5,1.5,0,1,0,17.5,10,1.5,1.5,0,0,0,16,11.5Zm3.09,1.55A4.49,4.49,0,0,0,19,10V5.5a1.5,1.5,0,0,0-3,0V9a3,3,0,0,0-3,3v7a1,1,0,0,0,1,1H20a4.48,4.48,0,0,0-.91-2.95ZM8,4.5A1.5,1.5,0,1,0,9.5,6,1.5,1.5,0,0,0,8,4.5Zm3.09,8.05A4.49,4.49,0,0,0,11,13v-2.5a1.5,1.5,0,0,0-3,0V12a3,3,0,0,0-3,3v7a1,1,0,0,0,1,1H12a4.48,4.48,0,0,0-.91-2.95Z"/>
          </svg>
          <span>Groups</span>
        </div>
        <div className="sidebar__discoverItem">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm0,4a1.5,1.5,0,1,1-1.5,1.5A1.5,1.5,0,0,1,12,6Zm4,11.75a8.63,8.63,0,0,1-6-2.75h-2v2.25A8.63,8.63,0,0,1,2.75,16H2v2h.75a6.62,6.62,0,0,0,5.25-2.75H10v-2H7.25A6.62,6.62,0,0,0,12,10.5a6.62,6.62,0,0,0,4.75,2H19v2h-.75a6.62,6.62,0,0,0-5.25,2.75H15v2h2.75a8.63,8.63,0,0,1-5.5,2.75V22h2Z"/>
          </svg>
          <span>Events</span>
        </div>
        <div className="sidebar__discoverItem">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M17,3H7A2,2,0,0,0,5,5V21L12,18L19,21V5A2,2,0,0,0,17,3Z"/>
          </svg>
          <span>Saved posts</span>
        </div>
      </div>

      <div className="sidebar__cardFooter">
        <span>Groups</span>
      </div>
    </div>
  );
}

export default Sidebar;