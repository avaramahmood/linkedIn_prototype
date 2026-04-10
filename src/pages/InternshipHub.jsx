import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import "./InternshipHub.css";

const INTERNSHIPS = [
  {
    id: 1,
    company: "Google",
    logo: "https://logo.clearbit.com/google.com",
    title: "Software Engineering Intern",
    location: "Remote",
    duration: "3 months",
    stipend: 80000,
    year: ["3rd", "4th"],
    domain: "Software Development",
    matchPercent: 92,
    skillsMatched: ["React", "JavaScript", "Python", "Git"],
    skillsMissing: ["Go"],
    postedAgo: "2d ago",
    applicants: 234,
  },
  {
    id: 2,
    company: "Microsoft",
    logo: "https://logo.clearbit.com/microsoft.com",
    title: "Data Science Intern",
    location: "Hybrid",
    duration: "6 months",
    stipend: 75000,
    year: ["3rd", "4th"],
    domain: "Data Science",
    matchPercent: 85,
    skillsMatched: ["Python", "SQL", "Statistics"],
    skillsMissing: ["Azure ML", "Spark"],
    postedAgo: "1d ago",
    applicants: 189,
  },
  {
    id: 3,
    company: "Figma",
    logo: "https://logo.clearbit.com/figma.com",
    title: "Product Design Intern",
    location: "Remote",
    duration: "3 months",
    stipend: 60000,
    year: ["2nd", "3rd"],
    domain: "Design",
    matchPercent: 78,
    skillsMatched: ["Figma", "UI/UX", "Prototyping"],
    skillsMissing: ["Motion Design", "User Research"],
    postedAgo: "5h ago",
    applicants: 97,
  },
  {
    id: 4,
    company: "Amazon",
    logo: "https://logo.clearbit.com/amazon.com",
    title: "Cloud Engineering Intern",
    location: "On-site",
    duration: "6 months",
    stipend: 90000,
    year: ["3rd", "4th"],
    domain: "Cloud & DevOps",
    matchPercent: 88,
    skillsMatched: ["AWS", "Docker", "Linux", "Python"],
    skillsMissing: ["Kubernetes"],
    postedAgo: "3d ago",
    applicants: 312,
  },
  {
    id: 5,
    company: "Stripe",
    logo: "https://logo.clearbit.com/stripe.com",
    title: "Backend Engineering Intern",
    location: "Remote",
    duration: "4 months",
    stipend: 85000,
    year: ["3rd", "4th"],
    domain: "Software Development",
    matchPercent: 91,
    skillsMatched: ["Node.js", "PostgreSQL", "REST APIs", "Git"],
    skillsMissing: ["Ruby"],
    postedAgo: "1d ago",
    applicants: 156,
  },
  {
    id: 6,
    company: "Spotify",
    logo: "https://logo.clearbit.com/spotify.com",
    title: "ML Research Intern",
    location: "Hybrid",
    duration: "6 months",
    stipend: 95000,
    year: ["4th"],
    domain: "Data Science",
    matchPercent: 72,
    skillsMatched: ["Python", "TensorFlow"],
    skillsMissing: ["NLP", "PyTorch", "Research Papers"],
    postedAgo: "4d ago",
    applicants: 78,
  },
  {
    id: 7,
    company: "Notion",
    logo: "https://logo.clearbit.com/notion.so",
    title: "Frontend Engineering Intern",
    location: "Remote",
    duration: "3 months",
    stipend: 70000,
    year: ["2nd", "3rd"],
    domain: "Software Development",
    matchPercent: 96,
    skillsMatched: ["React", "TypeScript", "CSS", "HTML", "Git"],
    skillsMissing: [],
    postedAgo: "6h ago",
    applicants: 201,
  },
  {
    id: 8,
    company: "Canva",
    logo: "https://logo.clearbit.com/canva.com",
    title: "UI/UX Design Intern",
    location: "On-site",
    duration: "3 months",
    stipend: 55000,
    year: ["1st", "2nd", "3rd"],
    domain: "Design",
    matchPercent: 81,
    skillsMatched: ["Figma", "Design Systems", "CSS"],
    skillsMissing: ["Illustration"],
    postedAgo: "2d ago",
    applicants: 143,
  },
];

const DOMAINS = ["All", "Software Development", "Data Science", "Design", "Cloud & DevOps"];
const YEARS = ["1st", "2nd", "3rd", "4th"];
const LOCATIONS = ["All", "Remote", "On-site", "Hybrid"];
const DURATIONS = ["All", "3 months", "4 months", "6 months"];

function MatchRing({ percent }) {
  const radius = 28;
  const stroke = 4;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;
  const color = percent >= 90 ? "#10b981" : percent >= 75 ? "#f59e0b" : "#ef4444";

  return (
    <div className="internship__matchRing">
      <svg width="64" height="64" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r={radius} fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth={stroke} />
        <circle
          cx="32" cy="32" r={radius} fill="none"
          stroke={color} strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="internship__matchProgress"
          style={{ "--target-offset": offset }}
        />
      </svg>
      <span className="internship__matchText" style={{ color }}>{percent}%</span>
    </div>
  );
}

function InternshipHub({ onNavigate }) {
  const user = useSelector(selectUser);
  const [selectedDomain, setSelectedDomain] = useState("All");
  const [selectedYear, setSelectedYear] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [selectedDuration, setSelectedDuration] = useState("All");
  const [minStipend, setMinStipend] = useState(0);
  const [sortBy, setSortBy] = useState("match");
  const [appliedIds, setAppliedIds] = useState([]);
  const [savedIds, setSavedIds] = useState([]);

  const toggleYear = (yr) => {
    setSelectedYear((prev) =>
      prev.includes(yr) ? prev.filter((y) => y !== yr) : [...prev, yr]
    );
  };

  const filtered = useMemo(() => {
    let list = [...INTERNSHIPS];
    if (selectedDomain !== "All") list = list.filter((i) => i.domain === selectedDomain);
    if (selectedYear.length > 0) list = list.filter((i) => i.year.some((y) => selectedYear.includes(y)));
    if (selectedLocation !== "All") list = list.filter((i) => i.location === selectedLocation);
    if (selectedDuration !== "All") list = list.filter((i) => i.duration === selectedDuration);
    if (minStipend > 0) list = list.filter((i) => i.stipend >= minStipend);

    if (sortBy === "match") list.sort((a, b) => b.matchPercent - a.matchPercent);
    else if (sortBy === "stipend") list.sort((a, b) => b.stipend - a.stipend);
    else if (sortBy === "recent") list.sort((a, b) => a.postedAgo.localeCompare(b.postedAgo));
    return list;
  }, [selectedDomain, selectedYear, selectedLocation, selectedDuration, minStipend, sortBy]);

  const avgStipend = Math.round(INTERNSHIPS.reduce((s, i) => s + i.stipend, 0) / INTERNSHIPS.length);

  return (
    <div className="internshipHub">
      <header className="internshipHub__header">
        <button className="internshipHub__back" onClick={() => onNavigate("home")}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          Back
        </button>
        <div className="internshipHub__headerContent">
          <h1>Internship Hub</h1>
          <p>Discover opportunities tailored to your skills and goals</p>
        </div>
      </header>

      {/* Stats Bar */}
      <div className="internshipHub__stats">
        <div className="internshipHub__statCard">
          <span className="internshipHub__statNumber">{INTERNSHIPS.length}</span>
          <span className="internshipHub__statLabel">Internships</span>
        </div>
        <div className="internshipHub__statCard">
          <span className="internshipHub__statNumber">INR {(avgStipend / 1000).toFixed(0)}K</span>
          <span className="internshipHub__statLabel">Avg Stipend/mo</span>
        </div>
        <div className="internshipHub__statCard">
          <span className="internshipHub__statNumber">3</span>
          <span className="internshipHub__statLabel">New This Week</span>
        </div>
        <div className="internshipHub__statCard internshipHub__statCard--accent">
          <span className="internshipHub__statNumber">92%</span>
          <span className="internshipHub__statLabel">Best Match</span>
        </div>
      </div>

      <div className="internshipHub__body">
        {/* Filter Sidebar */}
        <aside className="internshipHub__filters">
          <div className="internshipHub__filterHeader">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
            <h3>Filters</h3>
          </div>

          <div className="internshipHub__filterGroup">
            <h4>Domain</h4>
            <div className="internshipHub__filterPills">
              {DOMAINS.map((d) => (
                <button
                  key={d}
                  className={`internshipHub__pill ${selectedDomain === d ? "active" : ""}`}
                  onClick={() => setSelectedDomain(d)}
                >{d}</button>
              ))}
            </div>
          </div>

          <div className="internshipHub__filterGroup">
            <h4>Year</h4>
            <div className="internshipHub__filterPills">
              {YEARS.map((y) => (
                <button
                  key={y}
                  className={`internshipHub__pill ${selectedYear.includes(y) ? "active" : ""}`}
                  onClick={() => toggleYear(y)}
                >{y}</button>
              ))}
            </div>
          </div>

          <div className="internshipHub__filterGroup">
            <h4>Location</h4>
            <div className="internshipHub__filterPills">
              {LOCATIONS.map((l) => (
                <button
                  key={l}
                  className={`internshipHub__pill ${selectedLocation === l ? "active" : ""}`}
                  onClick={() => setSelectedLocation(l)}
                >{l}</button>
              ))}
            </div>
          </div>

          <div className="internshipHub__filterGroup">
            <h4>Duration</h4>
            <div className="internshipHub__filterPills">
              {DURATIONS.map((d) => (
                <button
                  key={d}
                  className={`internshipHub__pill ${selectedDuration === d ? "active" : ""}`}
                  onClick={() => setSelectedDuration(d)}
                >{d}</button>
              ))}
            </div>
          </div>

          <div className="internshipHub__filterGroup">
            <h4>Min Stipend</h4>
            <div className="internshipHub__rangeWrap">
              <input
                type="range" min="0" max="100000" step="5000"
                value={minStipend}
                onChange={(e) => setMinStipend(Number(e.target.value))}
              />
              <span className="internshipHub__rangeValue">INR {(minStipend / 1000).toFixed(0)}K+</span>
            </div>
          </div>

          <button className="internshipHub__clearFilters" onClick={() => {
            setSelectedDomain("All");
            setSelectedYear([]);
            setSelectedLocation("All");
            setSelectedDuration("All");
            setMinStipend(0);
          }}>Clear All Filters</button>
        </aside>

        {/* Main Content */}
        <main className="internshipHub__main">
          <div className="internshipHub__toolbar">
            <span className="internshipHub__resultCount">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>
            <div className="internshipHub__sortGroup">
              <span>Sort by:</span>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="match">Best Match</option>
                <option value="stipend">Highest Stipend</option>
                <option value="recent">Most Recent</option>
              </select>
            </div>
          </div>

          <div className="internshipHub__grid">
            {filtered.map((item) => (
              <div key={item.id} className="internshipCard">
                <div className="internshipCard__top">
                  <div className="internshipCard__companyInfo">
                    <img src={item.logo} alt={item.company} className="internshipCard__logo" onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${item.company}&background=0a66c2&color=fff&size=48`; }} />
                    <div>
                      <h3 className="internshipCard__title">{item.title}</h3>
                      <span className="internshipCard__company">{item.company}</span>
                    </div>
                  </div>
                  <MatchRing percent={item.matchPercent} />
                </div>

                <div className="internshipCard__meta">
                  <span className="internshipCard__tag internshipCard__tag--location">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    {item.location}
                  </span>
                  <span className="internshipCard__tag">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    {item.duration}
                  </span>
                  <span className="internshipCard__tag internshipCard__tag--stipend">
                    INR {(item.stipend / 1000).toFixed(0)}K/mo
                  </span>
                </div>

                <div className="internshipCard__skills">
                  <div className="internshipCard__skillRow">
                    <span className="internshipCard__skillLabel">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      You have
                    </span>
                    <div className="internshipCard__skillTags">
                      {item.skillsMatched.map((s) => (
                        <span key={s} className="internshipCard__skill internshipCard__skill--matched">{s}</span>
                      ))}
                    </div>
                  </div>
                  {item.skillsMissing.length > 0 && (
                    <div className="internshipCard__skillRow">
                      <span className="internshipCard__skillLabel">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="18" y1="6" x2="6" y2="18"/>
                          <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                        To learn
                      </span>
                      <div className="internshipCard__skillTags">
                        {item.skillsMissing.map((s) => (
                          <span key={s} className="internshipCard__skill internshipCard__skill--missing">{s}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="internshipCard__footer">
                  <div className="internshipCard__footerInfo">
                    <span className="internshipCard__posted">{item.postedAgo}</span>
                    <span className="internshipCard__applicants">{item.applicants} applicants</span>
                  </div>
                  <div className="internshipCard__actions">
                    <button
                      className={`internshipCard__save ${savedIds.includes(item.id) ? "saved" : ""}`}
                      onClick={() => setSavedIds((prev) => prev.includes(item.id) ? prev.filter((x) => x !== item.id) : [...prev, item.id])}
                      title={savedIds.includes(item.id) ? "Unsave" : "Save"}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill={savedIds.includes(item.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
                    </button>
                    <button
                      className={`internshipCard__apply ${appliedIds.includes(item.id) ? "applied" : ""}`}
                      onClick={() => {
                        if (!appliedIds.includes(item.id)) setAppliedIds((prev) => [...prev, item.id]);
                      }}
                    >
                      {appliedIds.includes(item.id) ? (
                        <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg> Applied</>
                      ) : (
                        <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> Apply Now</>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="internshipHub__empty">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <h3>No internships match your filters</h3>
                <p>Try adjusting your filters to see more results</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default InternshipHub;
