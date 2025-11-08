import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkUser, createUser, loginUser } from "./AuthService";
import AuthForm from "./AuthForm";
import "./Auth.css";

const AuthModule = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: ""
  });
  const [submit, setSubmit] = useState(false);

  // redirect already authenticated users back to home
  useEffect(() => {
    if (checkUser()) {
      alert("You are already logged in");
      navigate("/");
    }
  }, [navigate]);

  // handle login or register when form submits
  useEffect(() => {
    if (submit) {
      if (isLogin) {
        // LOGIN MODE
        loginUser(user).then((loggedInUser) => {
          if (loggedInUser) {
            alert(
              `${loggedInUser.get("firstName")}, you successfully logged in!`
            );
            navigate("/");
          }
          setSubmit(false);
        });
      } else {
        // REGISTER MODE
        createUser(user).then((createdUser) => {
          if (createdUser) {
            alert(
              `${createdUser.get("firstName")}, you successfully registered!`
            );
            navigate("/");
          }
          setSubmit(false);
        });
      }
    }
  }, [submit, isLogin, user, navigate]);

  const onChangeHandler = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    setSubmit(true);
  };

  // return form component with ability to toggle between login/register
  return (
    <div className="auth-form-container">
      <h2>{isLogin ? "Login" : "Create Account"}</h2>

      <AuthForm
        user={user}
        isLogin={isLogin}
        onChange={onChangeHandler}
        onSubmit={onSubmitHandler}
      />

      <p className="toggle-text">
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <button
          type="button"
          className="toggle-btn"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? "Register here" : "Login here"}
        </button>
      </p>
    </div>
  );
};

export default AuthModule;
