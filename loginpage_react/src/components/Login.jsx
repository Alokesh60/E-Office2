import React, { useState } from "react";
import "./Login.css";

function Login() {
  const [isActive, setIsActive] = useState(false);

  return (
    <div className={`container ${isActive ? "active" : ""}`}>
      {/* LOGIN FORM */}
      <div className="form-box login">
        <form action="#">
          <h1>Login</h1>
          <div className="input-box">
            <input type="text" placeholder="Username" required />
            <i className="bx bx-user"></i>
          </div>
          <div className="input-box">
            <input type="password" placeholder="Password" required />
            <i className="bx bxs-lock-alt"></i>
          </div>
          <div className="forget-link">
            <a href="#">Forgot password?</a>
          </div>
          <button type="submit" className="btn">
            Login
          </button>
          <p className="google-login">Log in with Google</p>
          <div className="social-icons">
            <a href="#">
              <i className="bx bxl-google"></i>
            </a>
          </div>
        </form>
      </div>

      {/* REGISTER FORM - All 'class' changed to 'className' */}
      <div className="form-box register">
        <form action="#">
          <h1 className="register-head">Register</h1>
          <div className="input-box">
            <input type="text" placeholder="Username" required />
            <i className="bx bx-user"></i>
          </div>

          <div className="input-box">
            {/* Fixed: Used defaultValue instead of selected attribute */}
            <select name="role" required defaultValue="">
              <option value="" disabled hidden>
                Select Role
              </option>
              <option value="student">Student</option>
              <option value="finance-officer">Finance Officer</option>
              <option value="dean">Dean</option>
              <option value="academic-administrator">
                Academic Administrator
              </option>
            </select>
            <i className="bx bxs-user-detail"></i>
          </div>

          <div className="input-box">
            <input type="email" placeholder="Email" required />
            <i className="bx bx-envelope"></i>
          </div>
          <div className="input-box">
            <input type="password" placeholder="Password" required />
            <i className="bx bxs-lock-alt"></i>
          </div>
          <div className="input-box">
            <input type="password" placeholder="Confirm Password" required />
            <i className="bx bxs-lock-alt"></i>
          </div>
          <button type="submit" className="btn">
            Register
          </button>
          <p className="google-login">Register with Google</p>
          <div className="social-icons">
            <a href="#">
              <i className="bx bxl-google"></i>
            </a>
          </div>
        </form>
      </div>

      {/* TOGGLE PANEL */}
      <div className="toggle-box">
        <div className="toggle-panel toggle-left">
          <h1>Hello, Welcome!</h1>
          <p>Don't have an account?</p>
          <button className="btn hidden" onClick={() => setIsActive(true)}>
            Register
          </button>
        </div>

        <div className="toggle-panel toggle-right">
          <h1>Welcome Back!</h1>
          <p>Already have an account?</p>
          <button className="btn hidden" onClick={() => setIsActive(false)}>
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
