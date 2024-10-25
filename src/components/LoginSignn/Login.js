// Login.js
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import user_icon from "../../assets/img/person.png";
import password_icon from "../../assets/img/password.png";
import "./LoginSignup.css"

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [progressWidth, setProgressWidth] = useState(0); // Progress bar width
  const navigate = useNavigate();

  useEffect(() => {
    let interval;
    if (showToast) {
      setProgressWidth(0);
      interval = setInterval(() => {
        setProgressWidth((prev) => (prev < 100 ? prev + 5 : 100));
      }, 100);

      setTimeout(() => {
        setShowToast(false);
        navigate("/home");
        clearInterval(interval);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [showToast, navigate]);

  const handleLogin = async () => {
    setErrorMessage("");
    const baseURL = "http://localhost:8080/api/auth";
    const loginData = { username, password };

    try {
      const response = await fetch(`${baseURL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      const result = await response.json();
      if (response.ok) {
        localStorage.setItem("token", result.token);
        localStorage.setItem("username", username);
        setToastMessage("Login successful!");
        setShowToast(true);
        setProgressWidth(0); // Reset progress
      } else {
        setErrorMessage(result.message || "Login failed");
        setTimeout(() => setErrorMessage(""), 1500);
      }
    } catch (error) {
      setErrorMessage("Error during login");
      console.error("Error during login:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-500 to-blue-400 flex items-center justify-center">
      <div className="w-full max-w-md p-8 rounded-lg bg-white shadow-lg">
        <h1 className="text-3xl font-bold text-center text-gray-800">Login</h1>
        <div className="h-1 w-24 bg-green-500 rounded-full mx-auto mt-2"></div>

        {/* Form Fields */}
        <div className="space-y-4 mt-6">
          {/* Username Field */}
          <div className="flex items-center border-b border-gray-300 pb-2">
            <img src={user_icon} alt="User Icon" className="mr-2" />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-600 rounded"
            />
          </div>

          {/* Password Field */}
          <div className="flex items-center border-b border-gray-300 pb-2">
            <img src={password_icon} alt="Password Icon" className="mr-2" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-600 rounded"
            />
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="text-red-500 text-center font-semibold mt-4">
              {errorMessage}
            </div>
          )}

          {/* Links */}
          <div className="flex justify-end mt-4">
            <Link to="/forgot-password" className="text-green-500 hover:text-green-600">
              Forgot Password?
            </Link>
          </div>
          {/* Action Buttons */}
          <div className="mt-4 flex justify-between">
            <button
              onClick={handleLogin}
              className="w-full py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-200"
            >
              Login
            </button>
          </div>

          <div className="flex justify-center mt-4">
            <button
              onClick={() => navigate("/signup")}
              className="text-gray-800"
            >
              Don't have an account?
              <span className="text-green-500 px-1 hover:text-green-600 hover:underline"> Sign Up</span>
            </button>
          </div>
        </div>

        {/* Toast Notification */}
        {showToast && ( // Toast message display
                <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded shadow-lg">
                    {toastMessage}
                    <div className="mt-2 w-full h-1 bg-green-500">
                        <div
                            className="h-full bg-green-300"
                            style={{ width: `${progressWidth}%`, transition: 'width 0.1s linear' }}
                        ></div>
                    </div>
                </div>
            )}
      </div>
    </div>
  );
};

export default Login;
