import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import user_icon from "../../assets/img/person.png";
import email_icon from "../../assets/img/email.png";
import password_icon from "../../assets/img/password.png";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [strengthMessage, setStrengthMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [progressWidth, setProgressWidth] = useState(0);
  const [role] = useState("USER");
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
        navigate("/login");
        clearInterval(interval);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [showToast, navigate]);

  const calculateStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[\W]/.test(password)) strength += 1; // special character check

    if (strength <= 1) return "Weak password";
    if (strength === 2) return "Moderate password";
    if (strength >= 3) return "Strong password";
  };

  const handlePasswordCheck = (e) => {
    const value = e.target.value;
    setPassword(value);
    setStrengthMessage(calculateStrength(value));
  };

  const handleSignup = async () => {
    setErrorMessage("");
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      setTimeout(() => setErrorMessage(""), 1500);
      return;
    }

    const baseURL = "http://localhost:8080/api/auth";
    const signupData = { username, email, password,role, securityQuestion, securityAnswer };

    try {
      const response = await fetch(`${baseURL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signupData),
      });

      const result = await response.json();
      if (response.ok) {
        setToastMessage("Sign-up successful!");
        setShowToast(true);
        setProgressWidth(0); // Reset progress
      } else {
        setErrorMessage(result.message || "Sign-up failed");
        setTimeout(() => setErrorMessage(""), 1500);
      }
    } catch (error) {
      setErrorMessage("Error during sign-up");
      console.error("Error during sign-up:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-500 to-blue-400 flex items-center justify-center">
      <div className="w-full max-w-md p-8 rounded-lg bg-white shadow-lg">
        <h1 className="text-3xl font-bold text-center text-gray-800">Sign Up</h1>
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

          {/* Email Field */}
          <div className="flex items-center border-b border-gray-300 pb-2">
            <img src={email_icon} alt="Email Icon" className="mr-2" />
            <input
              type="email"
              placeholder="Your Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-600 rounded"
            />
          </div>

          {/* Security Question Field */}
          <div className="flex items-center border-b border-gray-300 pb-2">
            <select
              value={securityQuestion}
              onChange={(e) => setSecurityQuestion(e.target.value)}
              className="w-full px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-600 rounded"
            >
              <option value="">Select Security Question</option>
              <option value="school">What was the name of your first school?</option>
              <option value="memory">What is your favorite childhood memory?</option>
              <option value="color">What is your favorite color?</option>
              <option value="city">What city were you born in?</option>
            </select>
          </div>

          {/* Security Answer Field */}
          <div className="flex items-center border-b border-gray-300 pb-2">
            <input
              type="text"
              placeholder="Security Answer"
              value={securityAnswer}
              onChange={(e) => setSecurityAnswer(e.target.value)}
              className="w-full px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-600 rounded"
            />
          </div>

          {/* Password Field */}
          <div className="flex flex-col border-b border-gray-300 pb-2">
              <div className="flex items-center">
                <img src={password_icon} alt="Password Icon" className="mr-2" />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={handlePasswordCheck}
                  className="w-full px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-600 rounded"
                />
              </div>
              {/* Password strength message */}
              {password && (
                <p className={`mt-2 ${strengthMessage === 'Strong password' ? 'text-green-500' : 'text-red-500'}`}>
                  {strengthMessage}
                </p>
              )}
            </div>

          {/* Confirm Password Field */}
          <div className="flex items-center border-b border-gray-300 pb-2">
            <img src={password_icon} alt="Password Icon" className="mr-2" />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-600 rounded"
            />
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="text-red-500 text-center font-semibold mt-4">
              {errorMessage}
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-4 flex justify-between">
            <button
              onClick={handleSignup}
              className="w-full py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-200"
            >
              Sign Up
            </button>
          </div>

          {/* Links */}
          <div className="flex justify-center mt-4">
            <button
              onClick={() => navigate("/login")}
              className="text-gray-800"
            >
              Already have an account?
              <span className="text-green-500 px-1 hover:text-green-600 hover:underline"> Login</span>
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

export default Signup;
