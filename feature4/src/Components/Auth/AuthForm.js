import React from "react";
import "./Auth.css";

const AuthForm = ({ user, isLogin, onChange, onSubmit }) => {
  return (
    <div className="auth-form-container">
        <form onSubmit={onSubmit} autoComplete="off">
        {!isLogin ? (
            <div>
            <div className="form-group">
                <label>First Name</label>
                <br />
                <input
                type="text"
                className="form-control"
                id="first-name-input"
                value={user.firstName}
                onChange={onChange}
                name="firstName"
                placeholder="First name"
                required
                />
            </div>
            <div className="form-group">
                <label>Last Name</label>
                <br />
                <input
                type="text"
                className="form-control"
                id="last-name-input"
                value={user.lastName}
                onChange={onChange}
                name="lastName"
                placeholder="Last name"
                required
                />
            </div>
            <div className="form-group">
                <label>Username</label>
                <br />
                <input
                type="text"
                className="form-control"
                id="username-input"
                value={user.username || ""}
                onChange={onChange}
                name="username"
                placeholder="Choose a unique username"
                required
                minLength="3"
                maxLength="20"
                pattern="[a-zA-Z0-9_]+"
                title="Username must be 3-20 characters, letters, numbers, and underscores only"
                />
                <small style={{ color: "#666", fontSize: "12px" }}>
                  3-20 characters, letters, numbers, and underscores only
                </small>
            </div>
            </div>
        ) : (
            <></>
        )}
        <div>
            <div className="form-group">
            <label>Email</label>
            <br />
            <input
                type="email"
                className="form-control"
                id="email-input"
                value={user.email}
                onChange={onChange}
                name="email"
                placeholder="Email address"
                required
            />
            </div>{" "}
            <div className="form-group">
            <label>Password</label>
            <br />
            <input
                type="password"
                className="form-control"
                id="password-input"
                value={user.password}
                onChange={onChange}
                name="password"
                placeholder="Password"
                minLength="6"
                required
            />
            </div>
            <div className="form-group">
            <button type="submit" className="btn btn-primary" onSubmit={onSubmit}>
                Submit
            </button>
            </div>
        </div>
        </form>
    </div>
  );
};

export default AuthForm;