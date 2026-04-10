/**
 * db.js — Local JSON Database
 * 
 * Persistent storage layer for posts and profile data.
 * All data is stored as JSON in localStorage, acting as a local database.
 * This data is consumed by the Skill Analysis feature.
 */

const POSTS_KEY = "linkedin_clone_posts_db";
const PROFILE_KEY = "linkedin_clone_profile_db";
const SKILLS_KEY = "linkedin_clone_skills_db";

// ========================
// POSTS DATABASE
// ========================

/** Get all posts from the JSON database */
export function getAllPosts() {
  try {
    const raw = localStorage.getItem(POSTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/** Save a new post to the JSON database */
export function savePost(post) {
  const posts = getAllPosts();
  posts.unshift({
    id: post.id || Date.now(),
    author: post.name || post.author || "User",
    message: post.message,
    headline: post.headline || "",
    timestamp: post.timestamp || new Date().toISOString(),
    savedAt: new Date().toISOString(),
  });
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
  return posts;
}

/** Bulk-save posts (used for initial mock data seeding) */
export function seedPosts(posts) {
  const existing = getAllPosts();
  const existingIds = new Set(existing.map(p => p.id));
  const newPosts = posts
    .filter(p => !existingIds.has(p.id))
    .map(p => ({
      id: p.id,
      author: p.name || p.author || "User",
      message: p.message,
      headline: p.headline || "",
      timestamp: p.timestamp || new Date().toISOString(),
      savedAt: new Date().toISOString(),
    }));
  const merged = [...newPosts, ...existing];
  localStorage.setItem(POSTS_KEY, JSON.stringify(merged));
  return merged;
}

/** Clear all posts */
export function clearAllPosts() {
  localStorage.removeItem(POSTS_KEY);
}

// ========================
// PROFILE DATABASE
// ========================

/** Get profile data from JSON database */
export function getProfile() {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/** Save profile data to JSON database */
export function saveProfile(profile) {
  const data = {
    name: profile.displayName || profile.name || "",
    email: profile.email || "",
    major: profile.major || "",
    year: profile.year || "",
    interests: profile.interests || [],
    photoUrl: profile.photoUrl || "",
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(PROFILE_KEY, JSON.stringify(data));
  return data;
}

// ========================
// SKILLS ANALYSIS DATABASE
// ========================

/** Get saved skill analysis from JSON database */
export function getSkillAnalysis() {
  try {
    const raw = localStorage.getItem(SKILLS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/** Save skill analysis results to JSON database */
export function saveSkillAnalysis(analysis) {
  const data = {
    ...analysis,
    analyzedAt: new Date().toISOString(),
  };
  localStorage.setItem(SKILLS_KEY, JSON.stringify(data));
  return data;
}

// ========================
// EXPORT FULL DATABASE
// ========================

/** Get the entire database as a single JSON object */
export function getFullDatabase() {
  return {
    profile: getProfile(),
    posts: getAllPosts(),
    skillAnalysis: getSkillAnalysis(),
    exportedAt: new Date().toISOString(),
  };
}
