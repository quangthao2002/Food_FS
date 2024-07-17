import { useContext, useState } from "react";

import "./LoginPopup.css";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";
import toast from "react-hot-toast";
import { assets } from "../../../../Admin/src/assets/assets";

// eslint-disable-next-line react/prop-types
const LoginPopup = ({ setShowLogin }) => {
  const { url, setToken } = useContext(StoreContext);
  const [currState, setCurrState] = useState("Sign in");
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const handleChange = async (event) => {
    setData({ ...data, [event.target.name]: event.target.value });
  };
  const handleSubmit = async (event) => {
    event.preventDefault();

    const currUrl =
      currState === "Sign up"
        ? `${url}/api/user/registerUser`
        : `${url}/api/user/loginUser`;
    try {
      const res = await axios.post(currUrl, data);
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        setToken(res.data.token);
        setShowLogin(false);
        toast.success(
          currState === "Sign up" ? "Account created" : "Login successful"
        );
      }
    } catch (err) {
      const errSignUp = err.response.data.message;
      toast.error(
        currState === "Sign up"
          ? errSignUp
          : "User name or password is incorrect"
      );
    }
  };

  return (
    <div className="login-popup">
      <form className="login-popup-container" onSubmit={handleSubmit}>
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <p onClick={() => setShowLogin(false)}>X</p>
        </div>
        <div className="login-popup-inputs">
          {currState === "Sign in" ? (
            <></>
          ) : (
            <input
              name="name"
              onChange={handleChange}
              type="text"
              placeholder="Your name"
              required
            />
          )}
          <input
            name="email"
            onChange={handleChange}
            type="email"
            placeholder="Your email"
            required
          />
          <input
            name="password"
            onChange={handleChange}
            type="password"
            placeholder="Password"
            required
          />
        </div>
        <button type="submit">
          {currState === "Sign up" ? "Sign up" : "Sign in"}
        </button>
        <div className="login-popup-condition">
          <input type="checkbox" required />
          <span>
            I agree to the <a href="#">Terms and Conditions</a>
          </span>
        </div>
        {currState === "Sign in" ? (
          <p>
            Create new account?{" "}
            <span onClick={() => setCurrState("Sign up")}>Click here</span>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <span onClick={() => setCurrState("Sign in")}> Sign up here</span>
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginPopup;
