import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [securityQuestion, setSecurityQuestion] = useState("");
    const [securityAnswer, setSecurityAnswer] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");
    const [showToast, setShowToast] = useState(false); // State for toast visibility
    const [toastMessage, setToastMessage] = useState(""); // State for toast message
    const [progressWidth, setProgressWidth] = useState(0); // State for progress width
    const [isPasswordReset, setIsPasswordReset] = useState(false); // State for password reset status

    const navigate = useNavigate(); // Initialize the useNavigate hook

    const handleSubmit = async () => {
        const data = { email, securityQuestion, securityAnswer, newPassword };

        try {
            const response = await fetch("http://localhost:8080/api/auth/forgot-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();
            if (response.ok) {
                setToastMessage("Password reset successfully!"); // Set the toast message
                setShowToast(true); // Show the toast
                setIsPasswordReset(true); // Set password reset status

                // Start progress
                let progress = 0;
                const interval = setInterval(() => {
                    if (progress < 100) {
                        progress += 5; // Increment progress
                        setProgressWidth(progress); // Update progress width
                    } else {
                        clearInterval(interval);
                    }
                }, 100); // Update every 100ms

                // Hide toast after a short duration
                setTimeout(() => {
                    clearInterval(interval); // Clear interval when hiding
                    navigate('/login');
                }, 3000); // 3 seconds delay
            } else {
                setMessage(result.message || "Error resetting password.");
            }
        } catch (error) {
            setMessage("Error resetting password.");
            console.error("Error during password reset:", error);
        }
    };

    // Hide the toast message after a certain duration
    useEffect(() => {
        if (showToast) {
            const timer = setTimeout(() => {
                setShowToast(false);
                setProgressWidth(0); // Reset progress when hiding
            }, 3000); // Toast will disappear after 3 seconds
            return () => clearTimeout(timer); // Clean up timer on unmount
        }
    }, [showToast]);

    return (
        <div className="min-h-screen bg-gradient-to-r from-green-500 to-blue-400 flex items-center justify-center">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg relative">
                {/* Back Arrow */}
                <ion-icon
                    name="arrow-back-outline"
                    class="absolute top-4 left-4 text-3xl text-green-500 cursor-pointer hover:text-green-700"
                    onClick={() => navigate('/login')}
                ></ion-icon>

                <h1 className="text-2xl font-bold text-center">Forgot Password?</h1>
                <div className="mt-4">

                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                />
                <select
                    value={securityQuestion}
                    onChange={(e) => setSecurityQuestion(e.target.value)}
                    className="w-full px-3 py-2 mt-4 border rounded-md"
                >
                    <option value="">Select a security question</option>
                    <option value="school">What was the name of your first school?</option>
                    <option value="memory">What is your favorite childhood memory?</option>
                    <option value="color">What is your favorite color?</option>
                    <option value="city">What city were you born in?</option>
                </select>
                <input
                    type="text"
                    placeholder="Answer"
                    value={securityAnswer}
                    onChange={(e) => setSecurityAnswer(e.target.value)}
                    className="w-full px-3 py-2 mt-4 border rounded-md"
                />
                <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 mt-4 border rounded-md"
                />

                    {!isPasswordReset && ( // Only show the input fields and reset button if the password has not been reset
                            <button
                            onClick={handleSubmit}
                            className="w-full px-4 py-2 mt-4 text-white bg-green-500 rounded-md hover:bg-green-600"
                            >
                            Reset Password
                            </button>
                    )}
                    {isPasswordReset && ( // Show link after successful reset
                        <div className="mt-4 text-center">
                            <p className="text-green-600">Your password has been reset successfully! You can now</p>
                            <button 
                                onClick={() => navigate('/login')} 
                                className="w-full px-4 py-2 text-white button bg-green-500 rounded-md hover:bg-green-600"
                            >
                                login
                            </button>
                        </div>
                    )}
                    {message && <p className="mt-4 text-center text-red-600">{message}</p>}
                </div>
            </div>
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
    );
};

export default ForgotPassword;
