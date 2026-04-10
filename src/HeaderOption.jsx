import React from "react";
import "./HeaderOption.css";

function HeaderOption({ avatar, Icon, title, onClick, active }) {
  return (
    <button onClick={onClick} className={`headerOption ${active ? 'active' : ''}`}>
      {Icon && <Icon />}
      {avatar && (
        <img
          src={avatar}
          alt={title}
          style={{ width: 24, height: 24, borderRadius: '50%', objectFit: 'cover' }}
        />
      )}
      <span className="headerOption__title">{title}</span>
    </button>
  );
}

export default HeaderOption;
