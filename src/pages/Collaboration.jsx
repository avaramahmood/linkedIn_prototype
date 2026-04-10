import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import "./Collaboration.css";

const PROJECTS = [
  {
    id: 1,
    title: "AI-Powered Resume Builder",
    author: "Priya Sharma",
    authorAvatar: "https://ui-avatars.com/api/?name=Priya+Sharma&background=10b981&color=fff&size=128&bold=true",
    description: "Building a web app that uses AI to generate tailored resumes from your LinkedIn profile. Need frontend developers and someone experienced with OpenAI APIs.",
    skills: ["React", "Node.js", "OpenAI API", "MongoDB"],
    lookingFor: ["Frontend Dev", "Backend Dev"],
    members: 2,
    maxMembers: 4,
    category: "AI/ML",
    matchPercent: 88,
    postedAgo: "3h ago",
    status: "open",
    chat: [
      { user: "Priya", msg: "Hey team! Let's start with the wireframes", time: "2h ago" },
      { user: "Arjun", msg: "I can handle the API integration", time: "1h ago" },
    ],
  },
  {
    id: 2,
    title: "Campus Event Management Platform",
    author: "Rahul Mehta",
    authorAvatar: "https://ui-avatars.com/api/?name=Rahul+Mehta&background=6366f1&color=fff&size=128&bold=true",
    description: "A platform for college students to discover, organize, and manage campus events. Includes ticketing, RSVPs, and a social feed for event discussions.",
    skills: ["React", "Firebase", "Tailwind CSS", "Figma"],
    lookingFor: ["UI/UX Designer", "Frontend Dev", "Backend Dev"],
    members: 1,
    maxMembers: 5,
    category: "Web Dev",
    matchPercent: 92,
    postedAgo: "6h ago",
    status: "open",
    chat: [
      { user: "Rahul", msg: "Looking for passionate devs! Let's build this", time: "5h ago" },
    ],
  },
  {
    id: 3,
    title: "Sustainability Tracker App",
    author: "Sarah Chen",
    authorAvatar: "https://ui-avatars.com/api/?name=Sarah+Chen&background=f59e0b&color=fff&size=128&bold=true",
    description: "A mobile-first web app that helps users track their carbon footprint, suggest eco-friendly alternatives, and compete with friends on sustainability goals.",
    skills: ["React Native", "Python", "Data Visualization", "REST APIs"],
    lookingFor: ["Mobile Dev", "Data Analyst"],
    members: 3,
    maxMembers: 5,
    category: "Social Impact",
    matchPercent: 74,
    postedAgo: "1d ago",
    status: "open",
    chat: [
      { user: "Sarah", msg: "We have the backend ready, need mobile devs!", time: "12h ago" },
      { user: "Emily", msg: "I'd love to help with the data viz part", time: "8h ago" },
      { user: "Sarah", msg: "Welcome aboard Emily!", time: "6h ago" },
    ],
  },
  {
    id: 4,
    title: "Peer-to-Peer Tutoring Marketplace",
    author: "Ananya Gupta",
    authorAvatar: "https://ui-avatars.com/api/?name=Ananya+Gupta&background=ec4899&color=fff&size=128&bold=true",
    description: "Connect students who need help with those who can teach. Features real-time video calls, scheduling, and a rating system. Great portfolio project!",
    skills: ["React", "WebRTC", "Socket.io", "PostgreSQL"],
    lookingFor: ["Full Stack Dev"],
    members: 2,
    maxMembers: 3,
    category: "EdTech",
    matchPercent: 81,
    postedAgo: "2d ago",
    status: "open",
    chat: [
      { user: "Ananya", msg: "MVP is ready, need help scaling!", time: "1d ago" },
    ],
  },
  {
    id: 5,
    title: "Open Source Portfolio Generator",
    author: "David Kim",
    authorAvatar: "https://ui-avatars.com/api/?name=David+Kim&background=0ea5e9&color=fff&size=128&bold=true",
    description: "A tool that auto-generates a beautiful portfolio website from your GitHub repos, LinkedIn profile, and a simple config file. Fully open source.",
    skills: ["Next.js", "GitHub API", "CSS", "TypeScript"],
    lookingFor: ["Frontend Dev", "Designer"],
    members: 3,
    maxMembers: 4,
    category: "Open Source",
    matchPercent: 95,
    postedAgo: "4h ago",
    status: "open",
    chat: [
      { user: "David", msg: "Just pushed the template engine, check it out!", time: "3h ago" },
      { user: "Nisha", msg: "Love the design direction", time: "2h ago" },
      { user: "David", msg: "Thanks! Need help with responsive styles", time: "1h ago" },
    ],
  },
  {
    id: 6,
    title: "Mental Health Check-in Bot",
    author: "Nisha Kapoor",
    authorAvatar: "https://ui-avatars.com/api/?name=Nisha+Kapoor&background=8b5cf6&color=fff&size=128&bold=true",
    description: "A friendly chatbot that checks in on students' wellbeing, suggests coping strategies, and connects them with campus counseling resources when needed.",
    skills: ["Python", "NLP", "React", "Flask"],
    lookingFor: ["ML Engineer", "Frontend Dev"],
    members: 2,
    maxMembers: 4,
    category: "Social Impact",
    matchPercent: 69,
    postedAgo: "3d ago",
    status: "open",
    chat: [
      { user: "Nisha", msg: "Training data collection is done ✅", time: "2d ago" },
    ],
  },
];

const CATEGORIES = ["All", "Web Dev", "AI/ML", "Social Impact", "EdTech", "Open Source"];

function MatchBadge({ percent }) {
  const color = percent >= 90 ? "#10b981" : percent >= 75 ? "#f59e0b" : "#94a3b8";
  return (
    <div className="collab__match" style={{ "--match-color": color }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
        <polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
      <span style={{ color }}>{percent}% match</span>
    </div>
  );
}

function Collaboration({ onNavigate }) {
  const user = useSelector(selectUser);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [joinedIds, setJoinedIds] = useState([]);
  const [showPostModal, setShowPostModal] = useState(false);
  const [expandedChat, setExpandedChat] = useState(null);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState({});
  const [sortBy, setSortBy] = useState("match");

  const filtered = selectedCategory === "All"
    ? PROJECTS
    : PROJECTS.filter((p) => p.category === selectedCategory);

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "match") return b.matchPercent - a.matchPercent;
    if (sortBy === "recent") return a.postedAgo.localeCompare(b.postedAgo);
    if (sortBy === "members") return (b.maxMembers - b.members) - (a.maxMembers - a.members);
    return 0;
  });

  const handleJoin = (id) => {
    if (!joinedIds.includes(id)) {
      setJoinedIds((prev) => [...prev, id]);
    }
  };

  const handleSendChat = (projectId) => {
    if (!chatInput.trim()) return;
    setChatMessages((prev) => ({
      ...prev,
      [projectId]: [
        ...(prev[projectId] || []),
        { user: user?.displayName?.split(" ")[0] || "You", msg: chatInput, time: "Just now" },
      ],
    }));
    setChatInput("");
  };

  return (
    <div className="collab">
      <header className="collab__header">
        <button className="collab__back" onClick={() => onNavigate("home")}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          Back
        </button>
        <div className="collab__headerContent">
          <h1>Project Collaboration</h1>
          <p>Find teammates, build together, and grow</p>
        </div>
        <button className="collab__postIdeaBtn" onClick={() => setShowPostModal(true)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
          Post Project Idea
        </button>
      </header>

      {/* Stats */}
      <div className="collab__stats">
        <div className="collab__statCard">
          <svg className="collab__statIcon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
            <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
          </svg>
          <div>
            <span className="collab__statNumber">{PROJECTS.length}</span>
            <span className="collab__statLabel">Active Projects</span>
          </div>
        </div>
        <div className="collab__statCard">
          <svg className="collab__statIcon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
          <div>
            <span className="collab__statNumber">{PROJECTS.reduce((s, p) => s + p.members, 0)}</span>
            <span className="collab__statLabel">Collaborators</span>
          </div>
        </div>
        <div className="collab__statCard">
          <svg className="collab__statIcon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
          </svg>
          <div>
            <span className="collab__statNumber">{new Set(PROJECTS.flatMap((p) => p.skills)).size}</span>
            <span className="collab__statLabel">Skills Represented</span>
          </div>
        </div>
        <div className="collab__statCard collab__statCard--highlight">
          <svg className="collab__statIcon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <circle cx="12" cy="12" r="6"/>
            <circle cx="12" cy="12" r="2"/>
          </svg>
          <div>
            <span className="collab__statNumber">95%</span>
            <span className="collab__statLabel">Best Match</span>
          </div>
        </div>
      </div>

      {/* Category Tabs + Sort */}
      <div className="collab__controls">
        <div className="collab__categories">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`collab__catTab ${selectedCategory === cat ? "active" : ""}`}
              onClick={() => setSelectedCategory(cat)}
            >{cat}</button>
          ))}
        </div>
        <div className="collab__sortGroup">
          <span>Sort:</span>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="match">Best Match</option>
            <option value="recent">Most Recent</option>
            <option value="members">Slots Available</option>
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="collab__grid">
        {sorted.map((project) => {
          const isJoined = joinedIds.includes(project.id);
          const allChats = [...project.chat, ...(chatMessages[project.id] || [])];
          return (
            <div key={project.id} className="collabCard">
              <div className="collabCard__top">
                <div className="collabCard__authorRow">
                  <img src={project.authorAvatar} alt={project.author} className="collabCard__authorAvatar" />
                  <div>
                    <span className="collabCard__authorName">{project.author}</span>
                    <span className="collabCard__posted">{project.postedAgo}</span>
                  </div>
                </div>
                <MatchBadge percent={project.matchPercent} />
              </div>

              <h3 className="collabCard__title">{project.title}</h3>
              <p className="collabCard__desc">{project.description}</p>

              <div className="collabCard__skills">
                {project.skills.map((s) => (
                  <span key={s} className="collabCard__skillTag">{s}</span>
                ))}
              </div>

              <div className="collabCard__lookingFor">
                <span className="collabCard__lfLabel">Looking for:</span>
                {project.lookingFor.map((role) => (
                  <span key={role} className="collabCard__roleTag">{role}</span>
                ))}
              </div>

              <div className="collabCard__membersBar">
                <div className="collabCard__membersInfo">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  <span>{project.members}/{project.maxMembers} members</span>
                </div>
                <div className="collabCard__memberDots">
                  {Array.from({ length: project.maxMembers }).map((_, i) => (
                    <div key={i} className={`collabCard__memberDot ${i < project.members ? "filled" : ""}`} />
                  ))}
                </div>
              </div>

              {/* Mini Chat Preview */}
              <div className={`collabCard__chat ${expandedChat === project.id ? "expanded" : ""}`}>
                <button className="collabCard__chatToggle" onClick={() => setExpandedChat(expandedChat === project.id ? null : project.id)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  Team Chat ({allChats.length})
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" className="collabCard__chatChevron"><polyline points="2 4 6 8 10 4"/></svg>
                </button>
                {expandedChat === project.id && (
                  <div className="collabCard__chatContent">
                    <div className="collabCard__chatMessages">
                      {allChats.map((msg, i) => (
                        <div key={i} className="collabCard__chatMsg">
                          <strong>{msg.user}</strong>
                          <span>{msg.msg}</span>
                          <span className="collabCard__chatTime">{msg.time}</span>
                        </div>
                      ))}
                    </div>
                    {(isJoined || joinedIds.includes(project.id)) && (
                      <div className="collabCard__chatInput">
                        <input
                          type="text"
                          placeholder="Type a message..."
                          value={expandedChat === project.id ? chatInput : ""}
                          onChange={(e) => setChatInput(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleSendChat(project.id)}
                        />
                        <button onClick={() => handleSendChat(project.id)}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="collabCard__footer">
                <span className="collabCard__category">{project.category}</span>
                <button
                  className={`collabCard__joinBtn ${isJoined ? "joined" : ""}`}
                  onClick={() => handleJoin(project.id)}
                  disabled={isJoined}
                >
                  {isJoined ? (
                    <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg> Joined</>
                  ) : (
                    <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg> Apply to Join</>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Post Idea Modal */}
      {showPostModal && (
        <div className="collab__modalOverlay" onClick={() => setShowPostModal(false)}>
          <div className="collab__modal" onClick={(e) => e.stopPropagation()}>
            <button className="collab__modalClose" onClick={() => setShowPostModal(false)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
            <h3 className="collab__modalTitle">Post a Project Idea</h3>
            <p className="collab__modalSubtitle">Find teammates and start building together</p>

            <div className="collab__formGroup">
              <label>Project Title</label>
              <input type="text" placeholder="e.g., AI-Powered Study Buddy App" />
            </div>
            <div className="collab__formGroup">
              <label>Description</label>
              <textarea placeholder="Describe your project idea, goals, and what you're looking to build..." rows="4"></textarea>
            </div>
            <div className="collab__formGroup">
              <label>Skills Needed</label>
              <input type="text" placeholder="e.g., React, Python, Figma (comma separated)" />
            </div>
            <div className="collab__formRow">
              <div className="collab__formGroup" style={{ flex: 1 }}>
                <label>Category</label>
                <select>
                  {CATEGORIES.filter((c) => c !== "All").map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="collab__formGroup" style={{ flex: 1 }}>
                <label>Team Size</label>
                <select>
                  <option>2-3 people</option>
                  <option>3-5 people</option>
                  <option>5+ people</option>
                </select>
              </div>
            </div>

            <button className="collab__submitBtn" onClick={() => setShowPostModal(false)}>
              Post Project Idea
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Collaboration;
