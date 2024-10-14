import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";

const HomePage = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [problems, setProblems] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notificationsDropdownOpen, setNotificationsDropdownOpen] =
    useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [newMessage, setNewMessage] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUsername = localStorage.getItem("username");
    const storedDarkMode = localStorage.getItem("darkMode") === "true";
    setToken(storedToken);
    setUsername(storedUsername);
    setDarkMode(storedDarkMode);

    const storedNotifications = JSON.parse(
      localStorage.getItem("notifications")
    );
    if (storedNotifications) {
      setNotifications(storedNotifications);
    } else {
      const defaultNotifications = [
        {
          id: 1,
          message: "New solution posted on your problem",
          isRead: false,
        },
        { id: 2, message: "User replied to your comment", isRead: false },
      ];
      setNotifications(defaultNotifications);
      localStorage.setItem(
        "notifications",
        JSON.stringify(defaultNotifications)
      );
    }

    document.body.className = darkMode ? "dark-mode" : "";
  }, [darkMode]);

  const fetchAllProblems = useCallback(async () => {
    if (!token) {
      console.error("No token found!");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("http://localhost:8080/api/problems", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          `HTTP error! Status: ${response.status}, Response: ${errorText}`
        );
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setProblems(data);
    } catch (error) {
      console.error("Error fetching problems:", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const fetchActiveUsers = useCallback(async () => {
    if (!token) {
      console.error("No token found!");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8080/api/auth/active-users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          `HTTP error! Status: ${response.status}, Response: ${errorText}`
        );
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setActiveUsers(data);
    } catch (error) {
      console.error("Error fetching Active Account:", error);
    }
  }, [token]);

  useEffect(() => {
    fetchAllProblems();
    fetchActiveUsers(); // Fetch Active Account when component mounts
  }, [fetchAllProblems, fetchActiveUsers]);

  const handleProblemSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      console.error("No token found!");
      return;
    }

    const problemData = { title, description };

    try {
      const response = await fetch("http://localhost:8080/api/problems", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(problemData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          `HTTP error! Status: ${response.status}, Response: ${errorText}`
        );
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      setProblems([...problems, result]);
      setTitle("");
      setDescription("");
      addNewNotification("Your problem was successfully posted!");
    } catch (error) {
      console.error("Error during problem creation:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setToken(null);
    setUsername(null);
    navigate("/login");
  };

  const handleDarkModeToggle = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", newDarkMode);
  };

  const handleDropdownToggle = () => setDropdownOpen(!dropdownOpen);

  const handleNotificationRead = (id) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification
      )
    );
    localStorage.setItem("notifications", JSON.stringify(notifications));
  };

  const addNewNotification = (message) => {
    const newNotification = {
      id: notifications.length + 1,
      message,
      isRead: false,
    };
    const updatedNotifications = [...notifications, newNotification];
    setNotifications(updatedNotifications);
    localStorage.setItem("notifications", JSON.stringify(updatedNotifications));

    // Set newMessage to true when a new notification is added
    setNewMessage(true);
  };

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-black text-green-500" : "bg-green-200 text-gray-900"
      }`}
    >
      {/* Header */}
      <header
        className={`shadow ${
          darkMode ? "bg-gray-900 text-green-500" : "bg-white text-gray-900"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap justify-between items-center">
          {/* Left Section - Brand and Navigation */}
          <div className="flex items-center space-x-4">
            <a href="/" className="text-xl font-bold">
              CrowdConnect
            </a>
            <div className="relative md:hidden">
              <button onClick={handleDropdownToggle}>
                <ion-icon name="menu-outline"></ion-icon>
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10">
                  <Link
                    to="/home"
                    className={`block px-4 py-2 text-gray-700 ${
                      darkMode ? "text-green-400" : "text-gray-700"
                    }`}
                    onClick={() => setDropdownOpen(false)}
                  >
                    Home
                  </Link>
                  <Link
                    to="/solutions"
                    className={`block px-4 py-2 text-gray-700 ${
                      darkMode ? "text-green-400" : "text-gray-700"
                    }`}
                    onClick={() => setDropdownOpen(false)}
                  >
                    Solutions
                  </Link>
                  <Link
                    to="/problems"
                    className={`block px-4 py-2 text-gray-700 ${
                      darkMode ? "text-green-400" : "text-gray-700"
                    }`}
                    onClick={() => setDropdownOpen(false)}
                  >
                    Problems
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Right Section - Search, Notifications, User Profile, and Dark Mode Toggle */}
          <div className="flex items-center flex-wrap space-x-4 mt-2 sm:mt-0">

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                className="relative"
                onClick={() =>
                  setNotificationsDropdownOpen(!notificationsDropdownOpen)
                }
                aria-label="Notifications"
              >
                <ion-icon name="notifications-outline"></ion-icon>
                {newMessage && (
                  <span className="absolute top-0 right-0 bg-red-500 rounded-full w-2 h-2"></span>
                )}
              </button>
              {notificationsDropdownOpen && (
                <div
                  className={`absolute mt-2 w-48 shadow-lg rounded-md p-2 ${
                    darkMode ? "bg-gray-900" : "bg-white"
                  }`}
                >
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-2 ${
                          notification.isRead ? "text-gray-500" : "font-bold"
                        }`}
                        onClick={() => handleNotificationRead(notification.id)}
                      >
                        {notification.message}
                      </div>
                    ))
                  ) : (
                    <div className="p-2">No new notifications</div>
                  )}
                </div>
              )}
            </div>

            {/* User Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center space-x-2"
                aria-label="User Profile"
              >
                <ion-icon name="person-outline"></ion-icon>
                <span>{username}</span>
              </button>
              {profileDropdownOpen && (
                <div
                  className={`absolute mt-2 w-48 shadow-lg rounded-md p-2 ${
                    darkMode ? "bg-gray-900" : "bg-white"
                  }`}
                >
                  <button
                    onClick={handleLogout}
                    className="block px-4 py-2 text-red-600"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={handleDarkModeToggle}
              aria-label="Toggle Dark Mode"
            >
              <ion-icon
                name={darkMode ? "sunny-outline" : "moon-outline"}
              ></ion-icon>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-4 flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
        {/* Active Account */}
        <aside
          className={`w-full lg:w-1/4 ${
            darkMode ? "bg-gray-800" : "bg-white"
          } shadow p-4 rounded-md`}
        >
          <h2 className="text-lg font-semibold mb-4">Active Account</h2>
          <ul>
            {activeUsers.length > 0 ? (
              activeUsers.map((user) => (
                <li key={user.id} className="py-2 space-x-2">
                  <ion-icon name="person-outline"></ion-icon>
                  <span>{user.username}</span>
                </li>
              ))
            ) : (
              <li className="space-x-2">
                <ion-icon name="person-outline"></ion-icon>
                <span>{username}</span>
              </li>
            )}
          </ul>
        </aside>

        {/* Problem Posting Form */}
        <section
          className={`flex-1 ${
            darkMode ? "bg-gray-800" : "bg-white"
          } shadow p-4 rounded-md`}
        >
          <h2 className="text-lg font-semibold mb-4">Post Your Problem</h2>
          <form onSubmit={handleProblemSubmit} className="mb-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              className={`border rounded-md w-full mb-2 px-2 py-1 ${
                darkMode
                  ? "bg-gray-700 text-green-500"
                  : "bg-white text-gray-900"
              }`}
              required
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              className={`border rounded-md w-full mb-2 px-2 py-1 ${
                darkMode
                  ? "bg-gray-700 text-green-500"
                  : "bg-white text-gray-900"
              }`}
              required
            />
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded-md"
            >
              Submit
            </button>
          </form>

          {/* List of Active Problems */}
          <h2 className="text-lg font-semibold mb-4">Active Problems</h2>
          <ul>
            {loading ? (
              <li>Loading problems...</li>
            ) : (
              problems.map((problem) => (
                <li key={problem.id} className="py-2">
                  <Link
                    to={`/solutions`}
                    className="text-grey-500 hover:underline"
                  >
                    {problem.title}
                  </Link>
                </li>
              ))
            )}
          </ul>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
