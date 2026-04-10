import React, { forwardRef, useState } from "react";
import "./Post.css";

const LikeIcon = ({ filled }) => (
  <svg width="24" height="24" viewBox="0 24 24" fill={filled ? "#2E8B57" : "none"} stroke="currentColor" strokeWidth="2">
    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
  </svg>
);

const CommentIcon = () => (
  <svg width="24" height="24" viewBox="0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);

const ShareIcon = () => (
  <svg width="24" height="24" viewBox="0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
    <polyline points="16 6 12 2 8 6"/>
    <line x1="12" y1="2" x2="12" y2="15"/>
  </svg>
);

const SendIcon = () => (
  <svg width="24" height="24" viewBox="0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="22" y1="2" x2="11" y2="13"/>
    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);

const MoreIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="1"/>
    <circle cx="19" cy="12" r="1"/>
    <circle cx="5" cy="12" r="1"/>
  </svg>
);

const Post = forwardRef(({ name, headline, photoUrl, timestamp, message, likes, comments }, ref) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  };

  return (
    <div ref={ref} className="post">
      <div className="post__header">
        <img src={photoUrl} alt={name} className="post__avatar" />
        <div className="post__info">
          <div className="post__meta">
            <span className="post__name">{name}</span>
            <span className="post__headline">{headline}</span>
            <span className="post__time">{timestamp}</span>
          </div>
        </div>
        <button className="post__more">
          <MoreIcon />
        </button>
      </div>
      <div className="post__content">
        <p className="post__message">{message}</p>
      </div>
      <div className="post__reactions">
        <div className="post__reactionsLeft">
          <svg width="16" height="16" viewBox="0 16 16">
            <circle cx="5" cy="5" r="4" fill="#2E8B57"/>
            <circle cx="11" cy="5" r="4" fill="#57B8EB"/>
            <circle cx="8" cy="10" r="4" fill="#E7663D"/>
          </svg>
          <span>{likeCount.toLocaleString()}</span>
        </div>
        <div className="post__reactionsRight">
          <span>{comments} comments</span>
        </div>
      </div>
      <div className="post__actions">
        <button className={`post__action ${liked ? 'post__action--liked' : ''}`} onClick={handleLike}>
          <LikeIcon filled={liked} />
          <span>Like</span>
        </button>
        <button className="post__action">
          <CommentIcon />
          <span>Comment</span>
        </button>
        <button className="post__action">
          <ShareIcon />
          <span>Share</span>
        </button>
        <button className="post__action">
          <SendIcon />
          <span>Send</span>
        </button>
      </div>
    </div>
  );
});

export default Post;
