import React, { useState } from "react";
import "./Login.css";

function Login() {
  const [isActive, setIsActive] = useState(false);

  // LOGIN STATE
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // REGISTER STATE
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // ✅ added
  const [studentId, setStudentId] = useState("");
  const [designation, setDesignation] = useState("");

  // LOGIN FUNCTION
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://127.0.0.1:8000/api/login-custom", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
        }),
      });

      const data = await res.json();

      console.log("Login response:", data); // ✅ debug

      if (data.status === "success") {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("role", data.user.role);
        alert("Login successful!");

        // redirect (optional)
        window.location.href = "/dashboard";
      } else {
        alert("Invalid credentials");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Login failed - check console");
    }
  };

  // REGISTER FUNCTION
  const handleRegister = async (e) => {
    e.preventDefault();

    console.log("Register clicked"); // ✅ debug

    // 🔐 PASSWORD MATCH CHECK
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const payload = {
      username,
      email,
      role,
      password,
    };

    if (role === "student") {
      payload.student_id = studentId;
    } else if (role === "staff") {
      payload.designation = designation;
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/api/custom-register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      console.log("Register response:", data); // ✅ debug

      if (data.status === "success") {
        alert("Registered successfully!");
        setUsername("");
        setEmail("");
        setRole("");
        setStudentId("");
        setDesignation("");
        setPassword("");
        setConfirmPassword("");
        setIsActive(false); // switch to login
      } else {
        alert("Registration failed");
      }
    } catch (err) {
      console.error("Register error:", err);
      alert("Registration failed - check console");
    }
  };

  return (
    <div className="login-page">
      <div className={`login-container ${isActive ? "active" : ""}`}>
        {/* LOGIN FORM */}
        <div className="form-box login">
          <form onSubmit={handleLogin}>
            <h1>Login</h1>

            <div className="input-box">
              <input
                type="email"
                placeholder="Email"
                required
                onChange={(e) => setLoginEmail(e.target.value)}
              />
              <i className="bx bx-user"></i>
            </div>

            <div className="input-box">
              <input
                type="password"
                placeholder="Password"
                required
                onChange={(e) => setLoginPassword(e.target.value)}
              />
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
          <form onSubmit={handleRegister}>
            <h1 className="register-head">Register</h1>

            <div className="input-box">
              <input
                type="text"
                placeholder="Username"
                required
                onChange={(e) => setUsername(e.target.value)}
              />
              <i className="bx bx-user"></i>
            </div>

            <div className="input-box">
              <select
                name="role"
                required
                value={role}
                onChange={(e) => {
                  setRole(e.target.value);
                  setStudentId("");
                  setDesignation("");
                }}
              >
                <option value="" disabled hidden>
                  Select Role
                </option>
                <option value="student">Student</option>
                <option value="staff">Staff / Faculty</option>
                <option value="admin">Administrator</option>
              </select>
              <i className="bx bxs-user-detail"></i>
            </div>

            {/* CONDITIONAL FIELD: Student ID */}
            {role === "student" && (
              <div className="input-box">
                <input
                  type="text"
                  placeholder="Student ID / Roll Number"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  required
                />
                <i className="bx bx-id-card"></i>
              </div>
            )}

            {/* CONDITIONAL FIELD: Staff Designation */}
            {role === "staff" && (
              <div className="input-box">
                <input
                  type="text"
                  placeholder="Designation (e.g. Dean Academic)"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  required
                />
                <i className="bx bx-briefcase"></i>
              </div>
            )}

            <div className="input-box">
              <input
                type="email"
                placeholder="Email"
                required
                onChange={(e) => setEmail(e.target.value)}
              />
              <i className="bx bx-envelope"></i>
            </div>

            <div className="input-box">
              <input
                type="password"
                placeholder="Password"
                required
                onChange={(e) => setPassword(e.target.value)}
              />
              <i className="bx bxs-lock-alt"></i>
            </div>

            <div className="input-box">
              <input
                type="password"
                placeholder="Confirm Password"
                required
                onChange={(e) => setConfirmPassword(e.target.value)} // ✅ fixed
              />
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
    </div>
  );
}

export default Login;
