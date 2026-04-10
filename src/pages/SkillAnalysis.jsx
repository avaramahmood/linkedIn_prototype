import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import { getAllPosts, getProfile, saveSkillAnalysis, getSkillAnalysis } from "../db";
import { OPENROUTER_API_KEY, OPENROUTER_URL } from "../config";
import "./SkillAnalysis.css";

function SkillBar({ name, score, evidence, delay }) {
  const color =
    score >= 80 ? "#10b981" : score >= 60 ? "#f59e0b" : score >= 40 ? "#3b82f6" : "#94a3b8";

  return (
    <div className="skillBar" style={{ animationDelay: `${delay}ms` }}>
      <div className="skillBar__header">
        <span className="skillBar__name">{name}</span>
        <span className="skillBar__score" style={{ color }}>
          {score}/100
        </span>
      </div>
      <div className="skillBar__track">
        <div
          className="skillBar__fill"
          style={{ "--target-width": `${score}%`, backgroundColor: color }}
        />
      </div>
      <p className="skillBar__evidence">{evidence}</p>
    </div>
  );
}

const TrophyIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
    <path d="M4 22h16"/>
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
  </svg>
);

const StarIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

const TrendingUpIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
    <polyline points="17 6 23 6 23 12"/>
  </svg>
);

const SeedlingIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M7 20h10"/>
    <path d="M10 20c5.5-2.5.8-6.4 3-10"/>
    <path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"/>
    <path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z"/>
  </svg>
);

const ChartIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="20" x2="18" y2="10"/>
    <line x1="12" y1="20" x2="12" y2="4"/>
    <line x1="6" y1="20" x2="6" y2="14"/>
  </svg>
);

function SkillAnalysis({ onNavigate }) {
  const user = useSelector(selectUser);
  const [dbPosts, setDbPosts] = useState([]);
  const [dbProfile, setDbProfile] = useState(null);
  const [skillResults, setSkillResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const posts = getAllPosts();
    const profile = getProfile();
    const savedSkills = getSkillAnalysis();
    setDbPosts(posts);
    setDbProfile(profile);
    if (savedSkills) setSkillResults(savedSkills);
  }, []);

  const buildInputJSON = () => {
    return {
      profile: dbProfile || {
        name: user?.displayName || "Unknown",
        email: user?.email || "",
        major: user?.major || "Not set",
        year: user?.year || "Not set",
        interests: user?.interests || [],
      },
      posts: dbPosts.map(p => ({
        message: p.message,
        author: p.author,
        timestamp: p.timestamp,
      })),
      metadata: {
        totalPosts: dbPosts.length,
        collectedAt: new Date().toISOString(),
      },
    };
  };

  const handleAnalyze = async () => {
    if (dbPosts.length === 0) return;
    setIsAnalyzing(true);
    setError("");

    const inputData = buildInputJSON();

    const prompt = `You are a skill assessment AI. Analyze the following user data (profile + social media posts) and infer their skill levels.

=== USER DATA (JSON) ===
${JSON.stringify(inputData, null, 2)}
=== END DATA ===

Based on the content of their posts AND their profile information, return a JSON object with the following structure:
{
  "skills": [
    { "name": "Skill Name", "score": <number 0-100>, "evidence": "Brief reason from post/profile content" }
  ],
  "summary": "A 2-3 sentence overall assessment of the user's expertise",
  "topDomain": "The primary domain/field this person works in",
  "level": "Beginner | Intermediate | Advanced | Expert",
  "recommendations": ["Skill they should learn next", "Another recommendation"]
}

Rules:
- Score each skill from 0 to 100 based on demonstrated knowledge
- Include 5-8 skills that are most evident from the data
- Be specific with skill names (e.g., "React.js" not just "Programming")
- The evidence should reference specific post content or profile data
- Include 2-3 learning recommendations
- Return ONLY valid JSON, no markdown or extra text`;

    try {
      const response = await fetch(OPENROUTER_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": window.location.origin,
        },
        body: JSON.stringify({
          model: "google/gemini-2.0-flash-001",
          messages: [
            { role: "system", content: "You are a skill assessment AI. Always respond with valid JSON only, no markdown." },
            { role: "user", content: prompt },
          ],
          temperature: 0.3,
          max_tokens: 1500,
        }),
      });

      if (!response.ok) throw new Error(`API error: ${response.status}`);

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || "";

      let jsonStr = content;
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch) jsonStr = jsonMatch[1].trim();
      const objMatch = jsonStr.match(/\{[\s\S]*\}/);
      if (objMatch) jsonStr = objMatch[0];

      const parsed = JSON.parse(jsonStr);
      const saved = saveSkillAnalysis(parsed);
      setSkillResults(saved);
    } catch (err) {
      console.error("Analysis error:", err);
      setError(err.message || "Failed to analyze. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getLevelIcon = (level) => {
    switch (level?.toLowerCase()) {
      case "expert": return <TrophyIcon />;
      case "advanced": return <StarIcon />;
      case "intermediate": return <TrendingUpIcon />;
      case "beginner": return <SeedlingIcon />;
      default: return <ChartIcon />;
    }
  };

  const getLevelColor = (level) => {
    switch (level?.toLowerCase()) {
      case "expert": return "#f59e0b";
      case "advanced": return "#10b981";
      case "intermediate": return "#3b82f6";
      case "beginner": return "#8b5cf6";
      default: return "#64748b";
    }
  };

  return (
    <div className="skillAnalysis">
      <header className="skillAnalysis__header">
        <button className="skillAnalysis__back" onClick={() => onNavigate("home")}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          Back
        </button>
        <div className="skillAnalysis__headerContent">
          <h1>Skill Analysis</h1>
          <p>AI-powered insights from your posts & profile</p>
        </div>
      </header>

      <div className="skillAnalysis__body">
        {dbPosts.length === 0 && !skillResults ? (
          <div className="skillAnalysis__empty">
            <div className="skillAnalysis__emptyIcon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10 9 9 9 8 9"/>
              </svg>
            </div>
            <h4>No data to analyze</h4>
            <p>Create posts on the home feed first. Each post is used for skill inference.</p>
            <button className="skillAnalysis__goHome" onClick={() => onNavigate("home")}>Go to Feed →</button>
          </div>
        ) : skillResults ? (
          <div className="skillAnalysis__results">
            {/* Analyze Button */}
            <button
              className="skillAnalysis__analyzeBtn"
              onClick={handleAnalyze}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <div className="skillAnalysis__spinner" />
                  Analyzing {dbPosts.length} posts...
                </>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a10 10 0 1 0 10 10"/><path d="M12 6v6l4 2"/></svg>
                  Re-analyze Skills
                </>
              )}
            </button>

            {/* Level Badge + Summary */}
            <div className="skillAnalysis__overviewCard">
              <div className="skillAnalysis__overviewTop">
                <div className="skillAnalysis__levelBadge" style={{ borderColor: getLevelColor(skillResults.level) }}>
                  <span className="skillAnalysis__levelEmoji">{getLevelIcon(skillResults.level)}</span>
                  <div>
                    <span className="skillAnalysis__levelLabel" style={{ color: getLevelColor(skillResults.level) }}>{skillResults.level}</span>
                    <span className="skillAnalysis__domain">{skillResults.topDomain}</span>
                  </div>
                </div>
                <div className="skillAnalysis__avgScore">
                  <span className="skillAnalysis__avgNumber">
                    {Math.round(skillResults.skills?.reduce((s, sk) => s + sk.score, 0) / (skillResults.skills?.length || 1))}
                  </span>
                  <span className="skillAnalysis__avgLabel">Avg Score</span>
                </div>
              </div>
              <p className="skillAnalysis__summary">{skillResults.summary}</p>
            </div>

            {/* Skill Bars */}
            <div className="skillAnalysis__skillsCard">
              <h3 className="skillAnalysis__skillsTitle">Skill Breakdown</h3>
              <div className="skillAnalysis__skillsList">
                {skillResults.skills?.sort((a, b) => b.score - a.score).map((skill, i) => (
                  <SkillBar key={skill.name} name={skill.name} score={skill.score} evidence={skill.evidence} delay={i * 100} />
                ))}
              </div>
            </div>

            {/* Recommendations */}
            {skillResults.recommendations?.length > 0 && (
              <div className="skillAnalysis__recsCard">
                <h3 className="skillAnalysis__recsTitle">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  Recommended Next Skills
                </h3>
                <div className="skillAnalysis__recsList">
                  {skillResults.recommendations.map((rec, i) => (
                    <div key={i} className="skillAnalysis__recItem">
                      <span className="skillAnalysis__recNum">{i + 1}</span>
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            <button
              className="skillAnalysis__analyzeBtn"
              onClick={handleAnalyze}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <div className="skillAnalysis__spinner" />
                  Analyzing {dbPosts.length} posts...
                </>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a10 10 0 1 0 10 10"/><path d="M12 6v6l4 2"/></svg>
                  Analyze My Skills ({dbPosts.length} posts)
                </>
              )}
            </button>

            {error && (
              <div className="skillAnalysis__error">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {error}
              </div>
            )}

            <div className="skillAnalysis__empty">
              <div className="skillAnalysis__emptyIcon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v6l4 2"/>
              </svg>
            </div>
              <h4>Ready to analyze</h4>
              <p>Click the button above to analyze {dbPosts.length} posts{dbProfile ? " and your profile data" : ""} using AI.</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default SkillAnalysis;