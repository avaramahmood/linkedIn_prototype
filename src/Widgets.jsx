import React from "react";
import InfoIcon from "@material-ui/icons/Info";
import AddIcon from "@material-ui/icons/Add";
import "./Widgets.css";

function Widgets() {
  const newsItems = [
    { title: "AI startups raise $10B in Q1 2026", subtitle: "1d ago • 12,847 readers" },
    { title: "Remote work policies evolve post-pandemic", subtitle: "2d ago • 8,234 readers" },
    { title: "Tech industry hiring trends to watch", subtitle: "3d ago • 6,521 readers" },
    { title: "LinkedIn's new features for professionals", subtitle: "4d ago • 4,128 readers" },
    { title: "Global economic outlook improves", subtitle: "5d ago • 3,947 readers" },
  ];

  const courses = [
    {
      title: "Leadership Fundamentals",
      views: "12.4K views",
      img: "https://images.unsplash.com/photo-1553028826-f4804a6dba3b?w=100",
    },
    {
      title: "Project Management",
      views: "8.7K views",
      img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
    },
    {
      title: "Data Science Basics",
      views: "6.2K views",
      img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100",
    },
  ];

  return (
    <div className="widgets">
      <div className="widgets__card">
        <div className="widgets__header">
          <h2 className="widgets__title">LinkedIn News</h2>
          <button className="widgets__headerIcon">
            <InfoIcon />
          </button>
        </div>
        <div className="widgets__list">
          {newsItems.map((item, index) => (
            <div key={index} className="widgets__item">
              <div className="widgets__itemLeft">
                <div className="widgets__itemIcon">•</div>
              </div>
              <div className="widgets__itemRight">
                <h4>{item.title}</h4>
                <p>{item.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="widgets__card">
        <div className="widgets__header">
          <h2 className="widgets__title">Today's most viewed courses</h2>
          <button className="widgets__headerIcon">
            <InfoIcon />
          </button>
        </div>
        <div className="widgets__courses">
          {courses.map((course, index) => (
            <div key={index} className="widgets__courseItem">
              <img src={course.img} alt={course.title} />
              <div className="widgets__courseInfo">
                <h4>{course.title}</h4>
                <p>{course.views}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="widgets__card">
        <div className="widgets__ad">
          <div className="widgets__adBanner">
            <svg viewBox="0 0 16 16">
              <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              <text x="8" y="11" textAnchor="middle" fontSize="8" fill="currentColor">i</text>
            </svg>
            <span>Ad</span>
          </div>
          <div className="widgets__adInfo">
            <span>Master your career. LinkedIn Learning has 10,000+ courses.</span>
          </div>
          <button className="widgets__adButton">Learn More</button>
        </div>
      </div>

      <div className="widgets__footer">
        <span>Show more</span>
      </div>
    </div>
  );
}

export default Widgets;
