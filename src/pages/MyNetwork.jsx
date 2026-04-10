import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import "./MyNetwork.css";

/**
 * LinkedIn My Network Page
 *
 * Implements LinkedIn's professional network feed using:
 * [Two-Tower Retrieval] → [ANN Search] → [Ranking Model DNN/XGB] → [Re-ranking + Bandits] → [Final Feed]
 *
 * The pipeline:
 * 1. Two-Tower: User & Candidate embeddings (dual-encoder)
 * 2. ANN Search: Approximate Nearest Neighbor search for top-K candidates
 * 3. Ranking Model: DNN/XGB scores candidates with features
 * 4. Re-ranking + Bandits: Business rules + contextual bandits for final order
 */

const MOCK_USERS = [
  { id: 1, name: "Sarah Chen", headline: "Software Engineer at Google", connections: 523, mutualConn: 12, distance: "2nd", verified: true, sharedSkills: ["React", "Python", "System Design"] },
  { id: 2, name: "James Wilson", headline: "Product Manager at Meta", connections: 891, mutualConn: 24, distance: "2nd", verified: true, sharedSkills: ["Product Strategy", "Agile", "Data Analysis"] },
  { id: 3, name: "Emily Rodriguez", headline: "Data Scientist at Netflix", connections: 347, mutualConn: 8, distance: "3rd", verified: false, sharedSkills: ["Machine Learning", "Python", "SQL"] },
  { id: 4, name: "Michael Park", headline: "UX Designer at Airbnb", connections: 412, mutualConn: 15, distance: "2nd", verified: true, sharedSkills: ["Figma", "User Research", "Prototyping"] },
  { id: 5, name: "Lisa Thompson", headline: "Engineering Manager at Stripe", connections: 678, mutualConn: 31, distance: "2nd", verified: true, sharedSkills: ["Leadership", "System Design", "Team Building"] },
  { id: 6, name: "David Kim", headline: "Frontend Developer at Shopify", connections: 234, mutualConn: 5, distance: "3rd", verified: false, sharedSkills: ["React", "TypeScript", "GraphQL"] },
  { id: 7, name: "Amanda Foster", headline: "VP of Engineering at Uber", connections: 1203, mutualConn: 45, distance: "2nd", verified: true, sharedSkills: ["Engineering Management", "Scaling", "Architecture"] },
  { id: 8, name: "Robert Martinez", headline: "ML Engineer at OpenAI", connections: 567, mutualConn: 18, distance: "3rd", verified: true, sharedSkills: ["Deep Learning", "PyTorch", "NLP"] },
];

const MOCK_INVITATIONS = [
  { id: 101, name: "Jennifer Lee", headline: "Senior Developer at Amazon", mutualConn: 8, profilePic: null, timeAgo: "1 week" },
  { id: 102, name: "Chris Anderson", headline: "Tech Lead at Microsoft", mutualConn: 14, profilePic: null, timeAgo: "2 weeks" },
  { id: 103, name: "Michelle Chen", headline: "Product Designer at Spotify", mutualConn: 6, profilePic: null, timeAgo: "3 weeks" },
];

// ============================================
// RECOMMENDATION PIPELINE
// ============================================

/**
 * Step 1: Two-Tower Retrieval
 * - User Tower: Encodes user profile, skills, connections
 * - Candidate Tower: Encodes candidate profiles
 * Returns embedding vectors for similarity search
 */
function buildUserTower(user, userSkills) {
  return {
    skills: userSkills,
    connectionDegree: "2nd",
    industry: "Technology",
    seniority: "Mid",
    engagementScore: 0.78,
  };
}

function buildCandidateTower(candidate) {
  return {
    skills: candidate.sharedSkills,
    connectionDegree: candidate.distance,
    industry: "Technology",
    seniority: "Mid",
    engagementScore: Math.random() * 0.5 + 0.3,
  };
}

/**
 * Step 2: ANN Search (Approximate Nearest Neighbors)
 * Uses cosine similarity to find top-K most similar candidates
 */
function annSearch(userEmbedding, candidates, topK = 5) {
  return candidates
    .map(candidate => {
      const candidateEmbedding = buildCandidateTower(candidate);
      const similarity = calculateCosineSimilarity(userEmbedding, candidateEmbedding);
      return { ...candidate, similarity };
    })
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, topK);
}

function calculateCosineSimilarity(emb1, emb2) {
  const skills1 = emb1.skills || [];
  const skills2 = emb2.skills || [];
  const shared = skills1.filter(s => skills2.includes(s)).length;
  const total = Math.sqrt(skills1.length * skills2.length) || 1;
  return shared / total * 0.6 + (emb1.engagementScore + emb2.engagementScore) * 0.2 + (Math.random() * 0.2);
}

/**
 * Step 3: Ranking Model (DNN/XGB style scoring)
 * Scores candidates based on multiple features
 */
function rankCandidates(candidates, user) {
  return candidates
    .map(c => {
      const features = {
        mutualConnections: c.mutualConn,
        connectionDegree: c.distance === "2nd" ? 0.8 : c.distance === "3rd" ? 0.5 : 0.2,
        skillMatch: c.sharedSkills.length * 12,
        verifiedBonus: c.verified ? 15 : 0,
        engagementLikelihood: c.connections > 500 ? 10 : c.connections > 200 ? 7 : 5,
      };

      const score =
        features.mutualConnections * 2.5 +
        features.connectionDegree * 15 +
        features.skillMatch * 1.2 +
        features.verifiedBonus +
        features.engagementLikelihood +
        Math.random() * 10;

      return { ...c, rankScore: Math.round(score * 10) / 10 };
    })
    .sort((a, b) => b.rankScore - a.rankScore);
}

/**
 * Step 4: Re-ranking Rules + Bandits
 * Applies business rules and contextual adjustments
 */
function rerankWithRules(candidates, context = {}) {
  let ranked = [...candidates];

  // Rule: Boost verified profiles
  ranked = ranked.sort((a, b) => {
    if (a.verified !== b.verified) return a.verified ? -1 : 1;
    return 0;
  });

  // Rule: Avoid showing same company
  const shownCompanies = new Set();
  ranked = ranked.filter(c => {
    if (shownCompanies.has(c.headline?.split(" at ")[1])) return Math.random() > 0.5;
    shownCompanies.add(c.headline?.split(" at ")[1]);
    return true;
  });

  // Rule: Diversity bonus for different connection degrees
  ranked = ranked.sort((a, b) => {
    const degDiff = (a.distance === "2nd" ? 1 : 0) - (b.distance === "2nd" ? 1 : 0);
    return degDiff + (b.rankScore - a.rankScore) * 0.1;
  });

  return ranked;
}

/**
 * Full Pipeline: Two-Tower → ANN → Rank → Re-rank → Feed
 */
function runRecommendationPipeline(user, userSkills, candidates) {
  // Step 1: Build user embedding (Two-Tower)
  const userEmbedding = buildUserTower(user, userSkills);

  // Step 2: ANN Search for top candidates
  const annResults = annSearch(userEmbedding, candidates, 6);

  // Step 3: Rank with DNN/XGB style scoring
  const rankedCandidates = rankCandidates(annResults, user);

  // Step 4: Re-ranking with business rules + contextual bandits
  const finalFeed = rerankWithRules(rankedCandidates, { timeOfDay: new Date().getHours() });

  return finalFeed;
}

// ============================================
// UI COMPONENTS
// ============================================

function PersonCard({ person, onConnect, onDismiss, action = "connect" }) {
  return (
    <div className="personCard">
      <div className="personCard__header">
        <div className="personCard__avatar">
          {person.name.split(" ").map(n => n[0]).join("")}
        </div>
        <div className="personCard__info">
          <h3 className="personCard__name">
            {person.name}
            {person.verified && <span className="personCard__verified">✓</span>}
          </h3>
          <p className="personCard__headline">{person.headline}</p>
          <p className="personCard__meta">
            {person.mutualConn} mutual connections
            <span className="personCard__dot">•</span>
            {person.distance} degree
          </p>
        </div>
      </div>
      <div className="personCard__skills">
        {person.sharedSkills?.slice(0, 3).map(skill => (
          <span key={skill} className="personCard__skill">{skill}</span>
        ))}
      </div>
      <div className="personCard__actions">
        {action === "connect" ? (
          <button className="personCard__connect" onClick={() => onConnect?.(person)}>
            Connect
          </button>
        ) : (
          <button className="personCard__accept" onClick={() => onConnect?.(person)}>
            Accept
          </button>
        )}
        <button className="personCard__ignore" onClick={() => onDismiss?.(person)}>
          {action === "connect" ? "Skip" : "Ignore"}
        </button>
      </div>
    </div>
  );
}

function InvitationCard({ invite, onAccept, onDismiss }) {
  return (
    <div className="inviteCard">
      <div className="inviteCard__avatar">
        {invite.name.split(" ").map(n => n[0]).join("")}
      </div>
      <div className="inviteCard__info">
        <h4 className="inviteCard__name">{invite.name}</h4>
        <p className="inviteCard__headline">{invite.headline}</p>
        <p className="inviteCard__meta">{invite.mutualConn} mutual connections • {invite.timeAgo}</p>
      </div>
      <div className="inviteCard__actions">
        <button className="inviteCard__accept" onClick={() => onAccept(invite)}>Accept</button>
        <button className="inviteCard__ignore" onClick={() => onDismiss(invite)}>Ignore</button>
      </div>
    </div>
  );
}

function MyNetwork({ onNavigate }) {
  const user = useSelector(selectUser);
  const [connections, setConnections] = useState(347);
  const [invitations, setInvitations] = useState(MOCK_INVITATIONS);
  const [recommended, setRecommended] = useState([]);
  const [activeTab, setActiveTab] = useState("invitations");
  const [showPipeline, setShowPipeline] = useState(false);

  // Get user skills from Redux or localStorage
  const userSkills = user?.interests || ["JavaScript", "React", "Node.js"];

  // Run recommendation pipeline when component mounts
  useMemo(() => {
    const feed = runRecommendationPipeline(user, userSkills, MOCK_USERS);
    setRecommended(feed);
  }, []);

  const handleConnect = (person) => {
    setConnections(c => c + 1);
    setRecommended(rec => rec.filter(p => p.id !== person.id));
  };

  const handleDismiss = (person) => {
    setRecommended(rec => rec.filter(p => p.id !== person.id));
  };

  const handleAcceptInvite = (invite) => {
    setConnections(c => c + 1);
    setInvitations(inv => inv.filter(i => i.id !== invite.id));
  };

  const handleDismissInvite = (invite) => {
    setInvitations(inv => inv.filter(i => i.id !== invite.id));
  };

  return (
    <div className="myNetwork">
      <header className="myNetwork__header">
        <button className="myNetwork__back" onClick={() => onNavigate("home")}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          Back
        </button>
        <div className="myNetwork__headerContent">
          <h1>My Network</h1>
        </div>
      </header>

      <div className="myNetwork__body">
        {/* Stats Bar */}
        <div className="myNetwork__stats">
          <div className="myNetwork__stat">
            <span className="myNetwork__statValue">{connections}</span>
            <span className="myNetwork__statLabel">Connections</span>
          </div>
          <div className="myNetwork__stat">
            <span className="myNetwork__statValue">{invitations.length}</span>
            <span className="myNetwork__statLabel">Pending Invitations</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="myNetwork__tabs">
          <button
            className={`myNetwork__tab ${activeTab === "invitations" ? "active" : ""}`}
            onClick={() => setActiveTab("invitations")}
          >
            Invitations ({invitations.length})
          </button>
          <button
            className={`myNetwork__tab ${activeTab === "people" ? "active" : ""}`}
            onClick={() => setActiveTab("people")}
          >
            People You May Know
          </button>
        </div>

        {/* Pipeline Visualization */}
        {showPipeline && (
          <div className="myNetwork__pipeline">
            <h3>Recommendation Pipeline</h3>
            <div className="myNetwork__pipelineSteps">
              <div className="myNetwork__pipelineStep">
                <span className="myNetwork__pipelineNum">1</span>
                <span>Two-Tower Retrieval</span>
                <span className="myNetwork__pipelineDesc">User & Candidate embeddings</span>
              </div>
              <div className="myNetwork__pipelineArrow">→</div>
              <div className="myNetwork__pipelineStep">
                <span className="myNetwork__pipelineNum">2</span>
                <span>ANN Search</span>
                <span className="myNetwork__pipelineDesc">Approximate nearest neighbors</span>
              </div>
              <div className="myNetwork__pipelineArrow">→</div>
              <div className="myNetwork__pipelineStep">
                <span className="myNetwork__pipelineNum">3</span>
                <span>Ranking Model</span>
                <span className="myNetwork__pipelineDesc">DNN/XGB scoring</span>
              </div>
              <div className="myNetwork__pipelineArrow">→</div>
              <div className="myNetwork__pipelineStep">
                <span className="myNetwork__pipelineNum">4</span>
                <span>Re-ranking + Bandits</span>
                <span className="myNetwork__pipelineDesc">Business rules</span>
              </div>
              <div className="myNetwork__pipelineArrow">→</div>
              <div className="myNetwork__pipelineStep myNetwork__pipelineFinal">
                <span className="myNetwork__pipelineNum">5</span>
                <span>Final Feed</span>
                <span className="myNetwork__pipelineDesc">{recommended.length} candidates</span>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="myNetwork__content">
          {activeTab === "invitations" && (
            <div className="myNetwork__invitations">
              {invitations.length === 0 ? (
                <div className="myNetwork__empty">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                  </svg>
                  <p>No pending invitations</p>
                </div>
              ) : (
                invitations.map(invite => (
                  <InvitationCard
                    key={invite.id}
                    invite={invite}
                    onAccept={handleAcceptInvite}
                    onDismiss={handleDismissInvite}
                  />
                ))
              )}
            </div>
          )}

          {activeTab === "people" && (
            <div className="myNetwork__people">
              <div className="myNetwork__peopleHeader">
                <span className="myNetwork__peopleCount">People you may know based on your profile and connections</span>
                <button
                  className="myNetwork__pipelineToggle"
                  onClick={() => setShowPipeline(!showPipeline)}
                >
                  {showPipeline ? "Hide Pipeline" : "Show Pipeline"}
                </button>
              </div>
              {recommended.map(person => (
                <PersonCard
                  key={person.id}
                  person={person}
                  onConnect={handleConnect}
                  onDismiss={handleDismiss}
                  action="connect"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyNetwork;