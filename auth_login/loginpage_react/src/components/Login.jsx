import { useState } from "react";
import "./Login.css";

function Login() {
  const [isActive, setIsActive] = useState(false);

  return (
    <div className={`container ${isActive ? "active" : ""}`}>
      {/* LOGIN FORM */}
      <div className="form-box login">
        <form action="">
          <h1>Login</h1>
          <div className="input-box">
            <input type="text" placeholder="Username" required />
            <i className="bx bx-user"></i>
          </div>

          <div className="input-box">
            {/* Added defaultValue to fix React warning */}
            <select required defaultValue="">
              <option value="" disabled>
                Select your role
              </option>
              <option value="student">Student</option>
              <option value="teacher">Finance Officer</option>
              <option value="dean">Dean</option>
              <option value="academic">Academic Administrator</option>
            </select>
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

      {/* REGISTER FORM */}
      <div className="form-box register">
        <form action="">
          <h1>Register</h1>
          <div className="input-box">
            <input type="text" placeholder="Username" required />
            <i className="bx bx-user"></i>
          </div>
          <div className="input-box">
            <input type="email" placeholder="Email" required />
            <i className="bx bx-envelope"></i>
          </div>
          <div className="input-box">
            <input type="password" placeholder="Password" required />
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

      {/* TOGGLE PANEL - Typo Fixed Here */}
      <div className="toggle-box">
        <div className="toggle-panel toggle-left">
          <h1>Hello, Welcome!</h1>
          <p style={{ color: "white" }}>Don't have an account?</p>
          <button
            className="btn"
            style={{ color: "white", borderColor: "white" }}
            onClick={() => setIsActive(true)}
          >
            Register
          </button>
        </div>

        <div className="toggle-panel toggle-right">
          <h1>Welcome Back!</h1>
          <p style={{ color: "white" }}>Already have an account?</p>
          <button
            className="btn"
            style={{ color: "white", borderColor: "white" }}
            onClick={() => setIsActive(false)}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
