import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { login } from "./features/userSlice.js";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [users, setUsers] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    fetch("/users.json")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("Failed to load users:", err));
  }, []);

  const loginToApp = (e) => {
    e.preventDefault();

    const user = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (user) {
      const name = user.email.split("@")[0].replace(".", " ");
      const displayName = name.charAt(0).toUpperCase() + name.slice(1);
      dispatch(
        login({
          displayName: displayName,
          email: user.email,
          photoUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=0a66c2&color=fff&size=128`,
        })
      );
    } else {
      alert("Invalid email or password");
    }
  };

  return (
    <div className="login">
      <header className="login__header">
        <img src="/LinkedInlogo.png" alt="LinkedIn" className="login__logo" />
      </header>
      <div className="login__card">
        <h1 className="login__title">Sign in</h1>
        <p className="login__subtitle">Stay updated on your professional world</p>
        <form className="login__form" onSubmit={loginToApp}>
          <div className="login__inputGroup">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="login__input"
            />
          </div>
          <div className="login__inputGroup">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login__input"
            />
          </div>
          <button type="submit" className="login__submit">Sign in</button>
        </form>
        <div className="login__forgot">
          <a>Forgot password?</a>
        </div>
        <div className="login__new">
          <p>New to LinkedIn? <span>Join now</span></p>
        </div>
      </div>
    </div>
  );
}

export default Login;
