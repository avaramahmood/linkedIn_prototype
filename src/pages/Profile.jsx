import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../features/userSlice";
import { OPENROUTER_API_KEY, OPENROUTER_URL } from "../config";
import { saveProfile } from "../db";
import "./Profile.css";

const CloseIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19"/>
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

const TIMELINE_PROMPT = `Generate a personalized learning roadmap for {name}, a {year} student majoring in {major}.

Return EXACTLY 6 timeline milestones covering the next 3 years. Return ONLY a valid JSON array with exactly 6 items - no markdown, no code blocks, no explanations.

IMPORTANT: Generate milestones that START from their CURRENT year, not from scratch:
- If {year} is Freshman: Start from Year 1 and plan through Year 4
- If {year} is Sophomore: Start from Year 2 and plan through graduation
- If {year} is Junior: Start from Year 3 and plan through Year 4
- If {year} is Senior: Focus on final year and job preparation
- If {year} is Graduate: Focus on advanced skills and career

Their target skills/interests: {skills}

Each milestone (6 total):
- id: number (1-6)
- phase: string like "Year 1 - Semester 1" or "Summer of Year 2"
- title: string (milestone title)
- skills: array of 2-3 specific skills to learn in this period
- description: string explaining what to focus on (1-2 sentences)

Return ONLY this exact JSON format with exactly 6 items. Example:
[{"id":1,"phase":"Year 1 - Fall","title":"Foundation","skills":["Python Programming","Data Structures"],"description":"Build strong programming foundations."}]`;

function Profile({ onBack }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);

  const [formData, setFormData] = useState({
    name: user?.displayName || "",
    major: user?.major || "",
    year: user?.year || "",
    interests: user?.interests || [],
  });

  // Sync formData when user data changes (e.g., after save or page revisit)
  useEffect(() => {
    setFormData({
      name: user?.displayName || "",
      major: user?.major || "",
      year: user?.year || "",
      interests: user?.interests || [],
    });
  }, [user?.displayName, user?.major, user?.year, user?.interests]);

  const [skillInput, setSkillInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [timeline, setTimeline] = useState([]);
  const [error, setError] = useState("");
  const [view, setView] = useState("form");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addSkill = () => {
    const skill = skillInput.trim();
    if (skill && !formData.interests.includes(skill)) {
      setFormData({
        ...formData,
        interests: [...formData.interests, skill]
      });
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      interests: formData.interests.filter(s => s !== skillToRemove)
    });
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSkill();
    }
  };

  const handleSave = () => {
    const updatedUser = {
      ...user,
      displayName: formData.name,
      major: formData.major,
      year: formData.year,
      interests: formData.interests,
      email: user?.email,
      photoUrl: user?.photoUrl,
    };
    dispatch(login(updatedUser));

    // Save to JSON database (localStorage)
    saveProfile(updatedUser);

    alert("Profile saved!");
  };

  const generateTimeline = async () => {
    if (!formData.name || !formData.major || !formData.year || formData.interests.length === 0) {
      alert("Please fill in all fields and add at least one skill interest");
      return;
    }

    setIsGenerating(true);
    setError("");
    try {
      const skillsStr = formData.interests.join(", ");

      const prompt = TIMELINE_PROMPT
        .replace("{name}", formData.name)
        .replace("{year}", formData.year)
        .replace("{major}", formData.major)
        .replace("{skills}", skillsStr);

      console.log("Generating roadmap...");

      const response = await fetch(OPENROUTER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        },
        body: JSON.stringify({
          model: "anthropic/claude-3-haiku",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.8,
          max_tokens: 2500,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `API Error: ${response.status}`);
      }

      const data = await response.json();
      let content = data.choices?.[0]?.message?.content || "[]";

      // Extract JSON array from the response
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        console.error("Raw content:", content);
        throw new Error("Could not find JSON in response");
      }

      const nodes = JSON.parse(jsonMatch[0]);

      if (!Array.isArray(nodes) || nodes.length === 0) {
        throw new Error("Invalid response - empty data");
      }

      setTimeline(nodes);
      setView("timeline");
    } catch (error) {
      console.error("Generation Error:", error);
      setError(error.message || "Failed to generate. Please try again.");
      alert(error.message || "Failed to generate. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const getPhaseColor = (index) => {
    const colors = ["#0a66c2", "#2E8B57", "#c37d16", "#9b59b6", "#e16745", "#17a2b8"];
    return colors[index % colors.length];
  };

  return (
    <div className="profile">
      <header className="profile__header">
        <button className="profile__back" onClick={onBack}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back
        </button>
        <h1>Learning Roadmap</h1>
        <div></div>
      </header>

      <div className="profile__content">
        {view === "form" ? (
          <div className="profile__form">
            <div className="profile__section">
              <h2>Your Information</h2>
              <div className="profile__field">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                />
              </div>
              <div className="profile__field">
                <label>Major / Field of Study</label>
                <input
                  type="text"
                  name="major"
                  value={formData.major}
                  onChange={handleChange}
                  placeholder="Computer Science"
                />
              </div>
              <div className="profile__field">
                <label>Current Year</label>
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="profile__select"
                >
                  <option value="">Select Year</option>
                  <option value="Freshman">Freshman (1st Year)</option>
                  <option value="Sophomore">Sophomore (2nd Year)</option>
                  <option value="Junior">Junior (3rd Year)</option>
                  <option value="Senior">Senior (4th Year)</option>
                  <option value="Graduate">Graduate Student</option>
                </select>
              </div>
              <div className="profile__field">
                <label>Skills You Want to Develop</label>
                <div className="profile__tagsInput">
                  <div className="profile__tags">
                    {formData.interests.map((skill, index) => (
                      <span key={index} className="profile__tag">
                        {skill}
                        <button onClick={() => removeSkill(skill)} className="profile__tagRemove">
                          <CloseIcon />
                        </button>
                      </span>
                    ))}
                    <input
                      type="text"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={handleSkillKeyDown}
                      onBlur={addSkill}
                      placeholder={formData.interests.length === 0 ? "Type a skill and press Enter..." : ""}
                      className="profile__tagInput"
                    />
                  </div>
                </div>
                <p className="profile__hint">Type a skill and press Enter or comma to add</p>
              </div>
            </div>

            {error && (
              <div className="profile__error">
                <strong>Error:</strong> {error}
              </div>
            )}

            <div className="profile__actions">
              <button className="profile__save" onClick={handleSave}>
                Save Profile
              </button>
              <button
                className="profile__generate"
                onClick={generateTimeline}
                disabled={isGenerating || !formData.name || !formData.major || !formData.year || formData.interests.length === 0}
              >
                {isGenerating ? (
                  <>
                    <span className="profile__spinner"></span>
                    Generating...
                  </>
                ) : (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    Recommended Timeline
                  </>
                )}
              </button>
            </div>

            <div className="profile__preview">
              <p>Add your skills as tags to get a personalized learning roadmap based on your current year and interests.</p>
            </div>
          </div>
        ) : (
          <div className="profile__timeline">
            <button className="profile__backBtn" onClick={() => setView("form")}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              Edit & Regenerate
            </button>

            <div className="profile__timelineCard">
              <div className="profile__timelineHeader">
                <img
                  src={user?.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name || "U")}&background=0a66c2&color=fff&size=128`}
                  alt={formData.name}
                  className="profile__timelineAvatar"
                />
                <div>
                  <h2>{formData.name}'s Learning Roadmap</h2>
                  <p>{formData.major} • {formData.year}</p>
                  <div className="profile__timelineSkills">
                    {formData.interests.map((skill, index) => (
                      <span key={index} className="profile__timelineSkill">{skill}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="profile__roadmap">
              {timeline.map((node, index) => (
                <div key={node.id} className="profile__roadmapItem">
                  <div className="profile__roadmapLeft">
                    <div
                      className="profile__roadmapDot"
                      style={{ backgroundColor: getPhaseColor(index) }}
                    >
                      <span>{index + 1}</span>
                    </div>
                    {index < timeline.length - 1 && (
                      <div
                        className="profile__roadmapLine"
                        style={{ backgroundColor: getPhaseColor(index) }}
                      />
                    )}
                  </div>
                  <div className="profile__roadmapContent">
                    <div className="profile__roadmapPhase" style={{ backgroundColor: getPhaseColor(index) }}>
                      {node.phase}
                    </div>
                    <h3 className="profile__roadmapTitle">{node.title}</h3>
                    <p className="profile__roadmapDesc">{node.description}</p>
                    <div className="profile__roadmapSkills">
                      {node.skills.map((skill, i) => (
                        <span key={i} className="profile__skillBadge" style={{ borderColor: getPhaseColor(index), color: getPhaseColor(index) }}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
