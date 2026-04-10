import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "./features/userSlice";
import { savePost, seedPosts } from "./db";
import Post from "./Post.jsx";
import FlipMove from 'react-flip-move';
import "./Feed.css";

const PhotoIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="#378fe9">
    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5-7l-3 3.72L9 13l-3 4h12l-4-5z"/>
  </svg>
);

const VideoIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="#c37d16">
    <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
  </svg>
);

const EventIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="#0a6640">
    <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"/>
  </svg>
);

const WriteIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="#e16745">
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
  </svg>
);

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const MOCK_POSTS = [
  {
    id: 1,
    name: "Sarah Chen",
    headline: "Product Manager at TechCorp | AI Enthusiast",
    photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    timestamp: "2h",
    message: "Thrilled to announce that our team just shipped a major feature that I've been working on for months! 🚀\n\nIt's been an incredible journey collaborating with such talented engineers and designers. Can't wait to see how users respond to it.\n\n#ProductLaunch #Teamwork #Innovation",
    likes: 847,
    comments: 124,
  },
  {
    id: 2,
    name: "Michael Rodriguez",
    headline: "Senior Software Engineer | Open Source Contributor",
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
    timestamp: "4h",
    message: "Just published my article on 'Best Practices for Building Scalable React Applications'.\n\nAfter 10 years in the industry, here are the key lessons I've learned:\n\n1. Start with the data model\n2. Keep components small and focused\n3. Invest in testing from day one\n4. Performance optimization is an ongoing process",
    likes: 1234,
    comments: 89,
  },
  {
    id: 3,
    name: "Emily Watson",
    headline: "UX Designer | Building beautiful products",
    photoUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
    timestamp: "6h",
    message: "Design tip of the day: White space is not wasted space.\n\nEvery element in your design needs room to breathe. Don't be afraid of empty space - it's what makes your content stand out and helps users focus on what matters most.",
    likes: 2156,
    comments: 178,
  },
  {
    id: 4,
    name: "David Kim",
    headline: "Data Scientist | ML/AI Researcher",
    photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
    timestamp: "8h",
    message: "The future of AI isn't about replacing humans - it's about augmenting human capabilities.\n\nExcited to share that our research paper on 'Human-AI Collaboration' has been accepted at NeurIPS 2026! 🎉",
    likes: 3421,
    comments: 256,
  },
];

function Feed() {
  const user = useSelector(selectUser);
  const [input, setInput] = useState("");
  const [posts, setPosts] = useState(MOCK_POSTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef(null);

  // Seed mock posts into JSON db on first load
  useEffect(() => {
    seedPosts(MOCK_POSTS);
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setInput("");
  };

  const sendPost = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newPost = {
      id: Date.now(),
      name: user?.displayName || 'User',
      headline: user?.email || 'LinkedIn Member',
      photoUrl: user?.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || 'U')}&background=0a66c2&color=fff`,
      timestamp: "Just now",
      message: input,
      likes: 0,
      comments: 0,
    };

    setPosts([newPost, ...posts]);

    // Save to JSON database (localStorage)
    savePost(newPost);

    setInput("");
    closeModal();
  };

  return (
    <div className="feed">
      <div className="feed__composer">
        <div className="feed__composerTop">
          <img
            src={user?.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || 'U')}&background=0a66c2&color=fff`}
            alt="Your avatar"
            className="feed__composerAvatar"
          />
          <button className="feed__composerButton" onClick={openModal}>
            Start a post
          </button>
        </div>
        <div className="feed__composerActions">
          <button className="feed__composerAction feed__composerAction--photo">
            <PhotoIcon />
            <span>Photo</span>
          </button>
          <button className="feed__composerAction feed__composerAction--video">
            <VideoIcon />
            <span>Video</span>
          </button>
          <button className="feed__composerAction feed__composerAction--event">
            <EventIcon />
            <span>Event</span>
          </button>
          <button className="feed__composerAction feed__composerAction--article">
            <WriteIcon />
            <span>Write</span>
          </button>
        </div>
      </div>

      <div className="feed__sortBar">
        <div className="feed__sortLabel">
          <span>Sort by:</span> Top
        </div>
      </div>

      <FlipMove>
        {posts.map((post) => (
          <Post key={post.id} {...post} />
        ))}
      </FlipMove>

      {isModalOpen && (
        <div className="feed__modalOverlay" onClick={closeModal}>
          <div className="feed__modal" ref={modalRef} onClick={(e) => e.stopPropagation()}>
            <div className="feed__modalHeader">
              <h2>Create post</h2>
              <button className="feed__modalClose" onClick={closeModal}>
                <CloseIcon />
              </button>
            </div>
            <div className="feed__modalBody">
              <div className="feed__modalUser">
                <img
                  src={user?.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || 'U')}&background=0a66c2&color=fff`}
                  alt={user?.displayName}
                />
                <div>
                  <h3>{user?.displayName || 'User'}</h3>
                  <button>Anyone</button>
                </div>
              </div>
              <textarea
                autoFocus
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="What do you want to talk about?"
                className="feed__modalTextarea"
              />
            </div>
            <div className="feed__modalFooter">
              <div className="feed__modalActions">
                <button><PhotoIcon /></button>
                <button><VideoIcon /></button>
                <button><EventIcon /></button>
                <button><WriteIcon /></button>
              </div>
              <button
                className="feed__modalPost"
                onClick={sendPost}
                disabled={!input.trim()}
              >
                Post
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Feed;
