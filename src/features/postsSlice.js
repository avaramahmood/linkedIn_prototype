import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { OPENROUTER_API_KEY, OPENROUTER_URL } from "../config";

// Async thunk to analyze skills from posts using LLM
export const analyzeSkills = createAsyncThunk(
  "posts/analyzeSkills",
  async (posts, { rejectWithValue }) => {
    const postTexts = posts.map((p, i) => `Post ${i + 1}: "${p.message}"`).join("\n");

    const prompt = `You are a skill assessment AI. Analyze the following social media posts written by a user and infer their skill levels.

${postTexts}

Based on ONLY the content of these posts, return a JSON object with the following structure:
{
  "skills": [
    { "name": "Skill Name", "score": <number 0-100>, "evidence": "Brief reason" }
  ],
  "summary": "A 2-3 sentence overall assessment of the user's expertise",
  "topDomain": "The primary domain/field this person works in",
  "level": "Beginner | Intermediate | Advanced | Expert"
}

Rules:
- Score each skill from 0 to 100 based on demonstrated knowledge
- Include 5-8 skills that are most evident from the posts
- Be specific with skill names (e.g., "React.js" not just "Programming")
- The evidence should reference specific post content
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
            { role: "system", content: "You are a skill assessment AI. Always respond with valid JSON only." },
            { role: "user", content: prompt },
          ],
          temperature: 0.3,
          max_tokens: 1024,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || "";
      
      // Extract JSON from the response (handle markdown code blocks)
      let jsonStr = content;
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch) {
        jsonStr = jsonMatch[1].trim();
      }
      
      const parsed = JSON.parse(jsonStr);
      return parsed;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const postsSlice = createSlice({
  name: "posts",
  initialState: {
    userPosts: [],       // Array of { id, message, timestamp, ... }
    skillAnalysis: null, // { skills: [...], summary, topDomain, level }
    analysisStatus: "idle", // "idle" | "loading" | "succeeded" | "failed"
    analysisError: null,
  },
  reducers: {
    addPost: (state, action) => {
      state.userPosts.unshift(action.payload);
      // Invalidate previous analysis when new post is added
      state.analysisStatus = "idle";
    },
    clearPosts: (state) => {
      state.userPosts = [];
      state.skillAnalysis = null;
      state.analysisStatus = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(analyzeSkills.pending, (state) => {
        state.analysisStatus = "loading";
        state.analysisError = null;
      })
      .addCase(analyzeSkills.fulfilled, (state, action) => {
        state.analysisStatus = "succeeded";
        state.skillAnalysis = action.payload;
      })
      .addCase(analyzeSkills.rejected, (state, action) => {
        state.analysisStatus = "failed";
        state.analysisError = action.payload;
      });
  },
});

export const { addPost, clearPosts } = postsSlice.actions;

export const selectUserPosts = (state) => state.posts.userPosts;
export const selectSkillAnalysis = (state) => state.posts.skillAnalysis;
export const selectAnalysisStatus = (state) => state.posts.analysisStatus;

export default postsSlice.reducer;
