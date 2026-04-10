import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import "./MentorConnect.css";

const MENTORS = [
  {
    id: 1,
    name: "Priya Sharma",
    avatar: "https://ui-avatars.com/api/?name=Priya+Sharma&background=6366f1&color=fff&size=128&bold=true",
    title: "Senior Software Engineer",
    company: "Google",
    companyLogo: "https://logo.clearbit.com/google.com",
    expertise: ["System Design", "DSA", "Career Growth"],
    category: "Technical Interview Prep",
    rating: 4.9,
    sessions: 127,
    bio: "10+ years at top tech companies. Passionate about helping students crack their dream roles.",
    availability: [true, false, true, true, false, true, false],
    sessionTypes: { quick: true, deep: true },
    price: { quick: 1, deep: 2 },
  },
  {
    id: 2,
    name: "Arjun Patel",
    avatar: "https://ui-avatars.com/api/?name=Arjun+Patel&background=10b981&color=fff&size=128&bold=true",
    title: "Product Manager",
    company: "Microsoft",
    companyLogo: "https://logo.clearbit.com/microsoft.com",
    expertise: ["Product Strategy", "Resume Building", "PM Interviews"],
    category: "Career Advice",
    rating: 4.8,
    sessions: 89,
    bio: "Former engineer turned PM. I help students transition into product roles and build the right mindset.",
    availability: [true, true, false, true, true, false, true],
    sessionTypes: { quick: true, deep: true },
    price: { quick: 1, deep: 2 },
  },
  {
    id: 3,
    name: "Sarah Chen",
    avatar: "https://ui-avatars.com/api/?name=Sarah+Chen&background=f59e0b&color=fff&size=128&bold=true",
    title: "Data Scientist",
    company: "Netflix",
    companyLogo: "https://logo.clearbit.com/netflix.com",
    expertise: ["ML/AI", "Data Analytics", "Python"],
    category: "Technical Interview Prep",
    rating: 4.7,
    sessions: 64,
    bio: "Stanford PhD, ex-Meta. I break down complex ML concepts into interview-ready answers.",
    availability: [false, true, true, false, true, true, false],
    sessionTypes: { quick: true, deep: true },
    price: { quick: 1, deep: 3 },
  },
  {
    id: 4,
    name: "Rahul Mehta",
    avatar: "https://ui-avatars.com/api/?name=Rahul+Mehta&background=ec4899&color=fff&size=128&bold=true",
    title: "Design Lead",
    company: "Figma",
    companyLogo: "https://logo.clearbit.com/figma.com",
    expertise: ["UI/UX", "Portfolio Review", "Design Systems"],
    category: "Resume Review",
    rating: 4.9,
    sessions: 103,
    bio: "I review portfolios and help designers craft narratives that get noticed by top companies.",
    availability: [true, false, false, true, true, true, false],
    sessionTypes: { quick: true, deep: true },
    price: { quick: 1, deep: 2 },
  },
  {
    id: 5,
    name: "Emily Rodriguez",
    avatar: "https://ui-avatars.com/api/?name=Emily+Rodriguez&background=0ea5e9&color=fff&size=128&bold=true",
    title: "Engineering Manager",
    company: "Stripe",
    companyLogo: "https://logo.clearbit.com/stripe.com",
    expertise: ["Leadership", "Team Building", "Backend Architecture"],
    category: "Industry Insights",
    rating: 4.6,
    sessions: 51,
    bio: "Managing 20+ engineers. I share insights on scaling teams, growing as a leader, and building great products.",
    availability: [false, true, true, true, false, false, true],
    sessionTypes: { quick: false, deep: true },
    price: { quick: 2, deep: 3 },
  },
  {
    id: 6,
    name: "Ananya Gupta",
    avatar: "https://ui-avatars.com/api/?name=Ananya+Gupta&background=8b5cf6&color=fff&size=128&bold=true",
    title: "Full Stack Developer",
    company: "Shopify",
    companyLogo: "https://logo.clearbit.com/shopify.com",
    expertise: ["React", "Node.js", "Career Transitions"],
    category: "Career Advice",
    rating: 4.8,
    sessions: 76,
    bio: "Self-taught to senior dev in 4 years. I mentor students on building projects that stand out.",
    availability: [true, true, true, false, true, false, true],
    sessionTypes: { quick: true, deep: true },
    price: { quick: 1, deep: 2 },
  },
  {
    id: 7,
    name: "David Kim",
    avatar: "https://ui-avatars.com/api/?name=David+Kim&background=14b8a6&color=fff&size=128&bold=true",
    title: "Senior Recruiter",
    company: "Amazon",
    companyLogo: "https://logo.clearbit.com/amazon.com",
    expertise: ["Resume Optimization", "ATS Tips", "Interview Coaching"],
    category: "Resume Review",
    rating: 4.9,
    sessions: 215,
    bio: "Reviewed 10,000+ resumes. I know exactly what gets you past the ATS and into the interview room.",
    availability: [true, true, false, true, true, true, true],
    sessionTypes: { quick: true, deep: true },
    price: { quick: 1, deep: 2 },
  },
  {
    id: 8,
    name: "Nisha Kapoor",
    avatar: "https://ui-avatars.com/api/?name=Nisha+Kapoor&background=f43f5e&color=fff&size=128&bold=true",
    title: "VP of Engineering",
    company: "Uber",
    companyLogo: "https://logo.clearbit.com/uber.com",
    expertise: ["Tech Industry", "Scaling", "Startup vs Corporate"],
    category: "Industry Insights",
    rating: 4.7,
    sessions: 42,
    bio: "From startup CTO to VP at Uber. Happy to share honest takes on the tech industry landscape.",
    availability: [false, false, true, true, false, true, false],
    sessionTypes: { quick: false, deep: true },
    price: { quick: 2, deep: 3 },
  },
];

const CATEGORIES = ["All", "Resume Review", "Career Advice", "Technical Interview Prep", "Industry Insights"];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const TIME_SLOTS = ["9:00 AM", "10:00 AM", "11:30 AM", "2:00 PM", "3:30 PM", "5:00 PM"];

function StarRating({ rating }) {
  return (
    <div className="mentorCard__stars">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg key={star} width="14" height="14" viewBox="0 0 24 24"
          fill={star <= Math.round(rating) ? "#f59e0b" : "none"}
          stroke="#f59e0b" strokeWidth="2"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
      <span>{rating}</span>
    </div>
  );
}

function MentorConnect({ onNavigate }) {
  const user = useSelector(selectUser);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [credits, setCredits] = useState(5);
  const [bookingMentor, setBookingMentor] = useState(null);
  const [sessionType, setSessionType] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookingStep, setBookingStep] = useState(1);
  const [bookedSessions, setBookedSessions] = useState([]);
  const [showEarnModal, setShowEarnModal] = useState(false);

  const filteredMentors = selectedCategory === "All"
    ? MENTORS
    : MENTORS.filter((m) => m.category === selectedCategory);

  const openBooking = (mentor) => {
    setBookingMentor(mentor);
    setSessionType(null);
    setSelectedSlot(null);
    setBookingStep(1);
  };

  const confirmBooking = () => {
    const cost = bookingMentor.price[sessionType];
    if (credits >= cost) {
      setCredits((c) => c - cost);
      setBookedSessions((prev) => [...prev, { mentorId: bookingMentor.id, type: sessionType, slot: selectedSlot }]);
      setBookingStep(3);
    }
  };

  const closeBooking = () => {
    setBookingMentor(null);
    setBookingStep(1);
  };

  const earnCredits = (amount) => {
    setCredits((c) => c + amount);
    setShowEarnModal(false);
  };

  return (
    <div className="mentorConnect">
      <header className="mentorConnect__header">
        <button className="mentorConnect__back" onClick={() => onNavigate("home")}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          Back
        </button>
        <div className="mentorConnect__headerContent">
          <h1>Mentor Connect</h1>
          <p>Book 1-on-1 sessions with industry professionals</p>
        </div>
      </header>

      {/* Credits Bar */}
      <div className="mentorConnect__creditsBar">
        <div className="mentorConnect__creditsInfo">
          <div className="mentorConnect__creditsBadge">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
            <span className="mentorConnect__creditsCount">{credits}</span>
            <span>credits remaining</span>
          </div>
          <button className="mentorConnect__earnBtn" onClick={() => setShowEarnModal(true)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
            Earn More
          </button>
        </div>
        <div className="mentorConnect__creditsHint">
          Complete your profile, take courses, or help others to earn credits
        </div>
      </div>

      {/* Category Tabs */}
      <div className="mentorConnect__categories">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`mentorConnect__catTab ${selectedCategory === cat ? "active" : ""}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Mentor Grid */}
      <div className="mentorConnect__grid">
        {filteredMentors.map((mentor) => {
          const isBooked = bookedSessions.some((s) => s.mentorId === mentor.id);
          return (
            <div key={mentor.id} className="mentorCard">
              <div className="mentorCard__header">
                <div className="mentorCard__avatarWrap">
                  <img src={mentor.avatar} alt={mentor.name} className="mentorCard__avatar" />
                  <div className="mentorCard__avatarGlow" />
                </div>
                <div className="mentorCard__info">
                  <h3 className="mentorCard__name">{mentor.name}</h3>
                  <div className="mentorCard__role">
                    <span>{mentor.title}</span>
                    <img src={mentor.companyLogo} alt={mentor.company} className="mentorCard__companyLogo" onError={(e) => { e.target.style.display = 'none'; }} />
                    <span className="mentorCard__companyName">{mentor.company}</span>
                  </div>
                </div>
              </div>

              <p className="mentorCard__bio">{mentor.bio}</p>

              <div className="mentorCard__expertise">
                {mentor.expertise.map((e) => (
                  <span key={e} className="mentorCard__expertiseTag">{e}</span>
                ))}
              </div>

              <div className="mentorCard__stats">
                <StarRating rating={mentor.rating} />
                <span className="mentorCard__sessionCount">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  {mentor.sessions} sessions
                </span>
              </div>

              <div className="mentorCard__availability">
                <span className="mentorCard__availLabel">This week:</span>
                <div className="mentorCard__availDots">
                  {DAYS.map((day, i) => (
                    <div key={day} className="mentorCard__availDay" title={day}>
                      <span className="mentorCard__dayLabel">{day.charAt(0)}</span>
                      <span className={`mentorCard__dot ${mentor.availability[i] ? "available" : ""}`} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="mentorCard__footer">
                <div className="mentorCard__pricing">
                  {mentor.sessionTypes.quick && <span className="mentorCard__priceTag">{mentor.price.quick} cr / 15min</span>}
                  {mentor.sessionTypes.deep && <span className="mentorCard__priceTag">{mentor.price.deep} cr / 30min</span>}
                </div>
                <button
                  className={`mentorCard__bookBtn ${isBooked ? "booked" : ""}`}
                  onClick={() => !isBooked && openBooking(mentor)}
                  disabled={isBooked}
                >
                  {isBooked ? (
                    <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg> Booked</>
                  ) : (
                    <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> Book Session</>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Booking Modal */}
      {bookingMentor && (
        <div className="mentorConnect__modalOverlay" onClick={closeBooking}>
          <div className="mentorConnect__modal" onClick={(e) => e.stopPropagation()}>
            <button className="mentorConnect__modalClose" onClick={closeBooking}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>

            {bookingStep === 1 && (
              <div className="mentorConnect__bookingStep">
                <div className="mentorConnect__bookingMentor">
                  <img src={bookingMentor.avatar} alt={bookingMentor.name} />
                  <div>
                    <h3>{bookingMentor.name}</h3>
                    <p>{bookingMentor.title} at {bookingMentor.company}</p>
                  </div>
                </div>
                <h4 className="mentorConnect__stepTitle">Choose Session Type</h4>
                <div className="mentorConnect__sessionTypes">
                  {bookingMentor.sessionTypes.quick && (
                    <button
                      className={`mentorConnect__sessionCard ${sessionType === "quick" ? "selected" : ""}`}
                      onClick={() => setSessionType("quick")}
                    >
                      <div className="mentorConnect__sessionIcon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                        </svg>
                      </div>
                      <h5>Quick Chat</h5>
                      <p>15 minutes</p>
                      <span className="mentorConnect__creditCost">{bookingMentor.price.quick} credit</span>
                    </button>
                  )}
                  {bookingMentor.sessionTypes.deep && (
                    <button
                      className={`mentorConnect__sessionCard ${sessionType === "deep" ? "selected" : ""}`}
                      onClick={() => setSessionType("deep")}
                    >
                      <div className="mentorConnect__sessionIcon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"/>
                          <circle cx="12" cy="12" r="6"/>
                          <circle cx="12" cy="12" r="2"/>
                        </svg>
                      </div>
                      <h5>Deep Dive</h5>
                      <p>30 minutes</p>
                      <span className="mentorConnect__creditCost">{bookingMentor.price.deep} credits</span>
                    </button>
                  )}
                </div>
                <button
                  className="mentorConnect__nextBtn"
                  disabled={!sessionType}
                  onClick={() => setBookingStep(2)}
                >
                  Choose Time Slot →
                </button>
              </div>
            )}

            {bookingStep === 2 && (
              <div className="mentorConnect__bookingStep">
                <h4 className="mentorConnect__stepTitle">Pick a Time Slot</h4>
                <div className="mentorConnect__slotsGrid">
                  {TIME_SLOTS.map((slot) => (
                    <button
                      key={slot}
                      className={`mentorConnect__slot ${selectedSlot === slot ? "selected" : ""}`}
                      onClick={() => setSelectedSlot(slot)}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
                <div className="mentorConnect__bookingSummary">
                  <span>{sessionType === "quick" ? "15 min" : "30 min"} session</span>
                  <span>•</span>
                  <span>{bookingMentor.price[sessionType]} credit{bookingMentor.price[sessionType] > 1 ? "s" : ""}</span>
                  {selectedSlot && <><span>•</span><span>{selectedSlot}</span></>}
                </div>
                {credits < bookingMentor.price[sessionType] && (
                  <div className="mentorConnect__insufficientCredits">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    Not enough credits. Earn more to book this session.
                  </div>
                )}
                <div className="mentorConnect__modalActions">
                  <button className="mentorConnect__backBtn" onClick={() => setBookingStep(1)}>← Back</button>
                  <button
                    className="mentorConnect__confirmBtn"
                    disabled={!selectedSlot || credits < bookingMentor.price[sessionType]}
                    onClick={confirmBooking}
                  >
                    Confirm Booking
                  </button>
                </div>
              </div>
            )}

            {bookingStep === 3 && (
              <div className="mentorConnect__bookingStep mentorConnect__success">
                <div className="mentorConnect__successIcon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="16 8 10 16 7 13" /></svg>
                </div>
                <h3>Session Booked!</h3>
                <p>Your {sessionType === "quick" ? "15-minute" : "30-minute"} session with <strong>{bookingMentor.name}</strong> is confirmed at <strong>{selectedSlot}</strong>.</p>
                <p className="mentorConnect__creditsLeft">Credits remaining: <strong>{credits}</strong></p>
                <button className="mentorConnect__doneBtn" onClick={closeBooking}>Done</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Earn Credits Modal */}
      {showEarnModal && (
        <div className="mentorConnect__modalOverlay" onClick={() => setShowEarnModal(false)}>
          <div className="mentorConnect__modal mentorConnect__earnModal" onClick={(e) => e.stopPropagation()}>
            <button className="mentorConnect__modalClose" onClick={() => setShowEarnModal(false)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
            <h3 className="mentorConnect__earnTitle">Earn Credits</h3>
            <p className="mentorConnect__earnSubtitle">Complete activities to earn session credits</p>
            <div className="mentorConnect__earnOptions">
              <button className="mentorConnect__earnOption" onClick={() => earnCredits(2)}>
                <div className="mentorConnect__earnIcon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                  </svg>
                </div>
                <div className="mentorConnect__earnInfo">
                  <h5>Complete Your Profile</h5>
                  <p>Add skills, experience, and a bio</p>
                </div>
                <span className="mentorConnect__earnReward">+2</span>
              </button>
              <button className="mentorConnect__earnOption" onClick={() => earnCredits(3)}>
                <div className="mentorConnect__earnIcon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                  </svg>
                </div>
                <div className="mentorConnect__earnInfo">
                  <h5>Complete a Course</h5>
                  <p>Finish any LinkedIn Learning course</p>
                </div>
                <span className="mentorConnect__earnReward">+3</span>
              </button>
              <button className="mentorConnect__earnOption" onClick={() => earnCredits(1)}>
                <div className="mentorConnect__earnIcon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 19l7-7 3 3-7 7-3-3z"/>
                    <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/>
                    <path d="M2 2l7.586 7.586"/>
                    <circle cx="11" cy="11" r="2"/>
                  </svg>
                </div>
                <div className="mentorConnect__earnInfo">
                  <h5>Write a Post</h5>
                  <p>Share insights with the community</p>
                </div>
                <span className="mentorConnect__earnReward">+1</span>
              </button>
              <button className="mentorConnect__earnOption" onClick={() => earnCredits(5)}>
                <div className="mentorConnect__earnIcon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                </div>
                <div className="mentorConnect__earnInfo">
                  <h5>Become a Mentor</h5>
                  <p>Help others and earn credits per session</p>
                </div>
                <span className="mentorConnect__earnReward">+5</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MentorConnect;
