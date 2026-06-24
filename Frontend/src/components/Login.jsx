import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import "./Login.css";

function Login() {
  const [isActive, setIsActive] = useState(false);

  // Apply body class for login page styling overrides
  useEffect(() => {
    document.body.classList.add("login-body");
    return () => {
      document.body.classList.remove("login-body");
    };
  }, []);

  // LOGIN STATE
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // REGISTER STATE
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [studentId, setStudentId] = useState("");
  const [designation, setDesignation] = useState("");

  // FORGOT PASSWORD STATE
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotOtp, setForgotOtp] = useState("");
  const [forgotStep, setForgotStep] = useState(1); // 1 = Enter Email, 2 = Verify OTP
  const [generatedOtp, setGeneratedOtp] = useState("");

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
        toast.success("Login successful!");

        // redirect (optional)
        window.location.href = "/dashboard";
      } else {
        toast.error("Invalid credentials");
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Login failed - check console");
    }
  };

  // REGISTER FUNCTION
  const handleRegister = async (e) => {
    e.preventDefault();

    console.log("Register clicked"); // ✅ debug

    // 🔐 PASSWORD MATCH CHECK
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
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
        toast.success("Registered successfully!");
        setUsername("");
        setEmail("");
        setRole("");
        setStudentId("");
        setDesignation("");
        setPassword("");
        setConfirmPassword("");
        setIsActive(false); // switch to login
      } else {
        toast.error("Registration failed");
      }
    } catch (err) {
      console.error("Register error:", err);
      toast.error("Registration failed - check console");
    }
  };

  // FORGOT PASSWORD HANDLERS
  const handleOpenForgotPassword = () => {
    setForgotEmail("");
    setForgotOtp("");
    setForgotStep(1);
    setGeneratedOtp("");
    setShowForgotModal(true);
  };

  const handleSendForgotOtp = (e) => {
    e.preventDefault();
    if (!forgotEmail) {
      toast.error("Please enter your registered email address.");
      return;
    }
    const code = "123456";
    setGeneratedOtp(code);
    
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1200)),
      {
        loading: "Sending OTP to " + forgotEmail + "...",
        success: <b>OTP sent! For demo verification, enter: 123456</b>,
        error: <b>Error sending OTP.</b>,
      }
    ).then(() => {
      setForgotStep(2);
    });
  };

  const handleVerifyForgotOtp = (e) => {
    e.preventDefault();
    if (forgotOtp === generatedOtp || forgotOtp === "123456") {
      toast.success("OTP verified successfully!");
      // Set localStorage token so protected route lets us in
      localStorage.setItem("token", "mock-forgot-password-token");
      localStorage.setItem("user", JSON.stringify({
        username: forgotEmail.split('@')[0],
        email: forgotEmail,
        role: "student"
      }));
      localStorage.setItem("role", "student");
      
      setShowForgotModal(false);
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 500);
    } else {
      toast.error("Invalid OTP code. Please try again.");
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
                type={showLoginPassword ? "text" : "password"}
                placeholder="Password"
                required
                onChange={(e) => setLoginPassword(e.target.value)}
              />
              <i
                className={`bx ${showLoginPassword ? "bx-hide" : "bx-show"}`}
                onClick={() => setShowLoginPassword(!showLoginPassword)}
                style={{ cursor: "pointer" }}
              ></i>
            </div>

            <div className="forget-link">
              <a href="#" onClick={(e) => { e.preventDefault(); handleOpenForgotPassword(); }}>Forgot password?</a>
            </div>

            <button type="submit" className="auth-btn">
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
                  placeholder="Employee Id"
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
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                required
                onChange={(e) => setPassword(e.target.value)}
              />
              <i
                className={`bx ${showPassword ? "bx-hide" : "bx-show"}`}
                onClick={() => setShowPassword(!showPassword)}
                style={{ cursor: "pointer" }}
              ></i>
            </div>

            <div className="input-box">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                required
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <i
                className={`bx ${showConfirmPassword ? "bx-hide" : "bx-show"}`}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{ cursor: "pointer" }}
              ></i>
            </div>

            <button type="submit" className="auth-btn">
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
            <button className="auth-btn toggle-btn" onClick={() => setIsActive(true)}>
              Register
            </button>
          </div>

          <div className="toggle-panel toggle-right">
            <h1>Welcome Back!</h1>
            <p>Already have an account?</p>
            <button className="auth-btn toggle-btn" onClick={() => setIsActive(false)}>
              Login
            </button>
          </div>
        </div>
      </div>

      {/* FORGOT PASSWORD MODAL */}
      {showForgotModal && (
        <div className="forgot-modal-overlay">
          <div className="forgot-modal-container">
            <button type="button" className="forgot-modal-close" onClick={() => setShowForgotModal(false)}>
              <i className="bx bx-x"></i>
            </button>
            
            {forgotStep === 1 ? (
              <form onSubmit={handleSendForgotOtp} className="forgot-modal-form">
                <h2>Reset Password</h2>
                <p className="forgot-modal-desc">
                  Enter your registered email address below. We'll send you a 6-digit OTP code to verify your account.
                </p>
                <div className="input-box">
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                  />
                  <i className="bx bx-envelope"></i>
                </div>
                <button type="submit" className="auth-btn">
                  Send OTP
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyForgotOtp} className="forgot-modal-form">
                <h2>Verify OTP</h2>
                <p className="forgot-modal-desc">
                  We've sent a 6-digit verification code to <strong>{forgotEmail}</strong>. Please enter the OTP below.
                </p>
                <div className="input-box">
                  <input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={forgotOtp}
                    onChange={(e) => setForgotOtp(e.target.value)}
                    maxLength={6}
                    required
                  />
                  <i className="bx bx-key"></i>
                </div>
                <button type="submit" className="auth-btn">
                  Verify & Proceed
                </button>
                <div className="resend-link">
                  Didn't receive the code?{" "}
                  <a href="#" onClick={(e) => { e.preventDefault(); handleSendForgotOtp(e); }}>
                    Resend OTP
                  </a>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
