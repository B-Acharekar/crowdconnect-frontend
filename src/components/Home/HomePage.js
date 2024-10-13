import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const HomePage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [problems, setProblems] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [newMessage, setNewMessage] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');
    const storedDarkMode = localStorage.getItem('darkMode') === 'true';
    setToken(storedToken);
    setUsername(storedUsername);
    setDarkMode(storedDarkMode);

    const storedNotifications = JSON.parse(localStorage.getItem('notifications'));
    if (storedNotifications) {
      setNotifications(storedNotifications);
    } else {
      const defaultNotifications = [
        { id: 1, message: 'New solution posted on your problem', isRead: false },
        { id: 2, message: 'User replied to your comment', isRead: false },
      ];
      setNotifications(defaultNotifications);
      localStorage.setItem('notifications', JSON.stringify(defaultNotifications));
    }

    document.body.className = darkMode ? 'dark-mode' : '';

  }, [darkMode]);

  const fetchAllProblems = useCallback(async () => {
    if (!token) {
      console.error('No token found!');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/api/problems', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`HTTP error! Status: ${response.status}, Response: ${errorText}`);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setProblems(data);
    } catch (error) {
      console.error('Error fetching problems:', error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const fetchActiveUsers = useCallback(async () => {
    if (!token) {
      console.error('No token found!');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/active-users', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`HTTP error! Status: ${response.status}, Response: ${errorText}`);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setActiveUsers(data);
    } catch (error) {
      console.error('Error fetching active users:', error);
    }
  }, [token]);

  useEffect(() => {
    fetchAllProblems();
    fetchActiveUsers(); // Fetch active users when component mounts
  }, [fetchAllProblems, fetchActiveUsers]);

  const handleProblemSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      console.error('No token found!');
      return;
    }

    const problemData = { title, description };

    try {
      const response = await fetch('http://localhost:8080/api/problems', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(problemData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`HTTP error! Status: ${response.status}, Response: ${errorText}`);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      setProblems([...problems, result]);
      setTitle('');
      setDescription('');
      addNewNotification('Your problem was successfully posted!');
    } catch (error) {
      console.error('Error during problem creation:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setToken(null);
    setUsername(null);
    navigate('/login');
  };

  const handleDarkModeToggle = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode);
  };

  const handleNotificationRead = (id) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === id ? { ...notification, isRead: true } : notification
      )
    );
    localStorage.setItem('notifications', JSON.stringify(notifications));
  };

  const addNewNotification = (message) => {
    const newNotification = { id: notifications.length + 1, message, isRead: false };
    const updatedNotifications = [...notifications, newNotification];
    setNotifications(updatedNotifications);
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
    
    // Set newMessage to true when a new notification is added
    setNewMessage(true);
};


  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-blue-100 text-gray-900'}`}>
      {/* Header */}
      <header className={`shadow ${darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'}`}>
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <a href="/" className="text-xl font-bold">CrowdConnect</a>
            <nav className="space-x-4">
              <Link to="/home" className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Home</Link>
              <Link to="/followers" className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Following</Link>
              <Link to="/solutions" className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Solutions</Link>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Search..."
              className={`border rounded-lg px-4 py-2 ${darkMode ? 'bg-gray-700 text-gray-100' : 'bg-white text-gray-900'}`}
            />
            <button className="relative" onClick={() => setDropdownOpen(!dropdownOpen)}>
              <ion-icon name="notifications-outline"></ion-icon>
              {newMessage && (
                <span className="absolute top-0 right-0 bg-red-500 rounded-full w-2 h-2"></span>
              )}
            </button>
            {dropdownOpen && (
              <div className={`absolute mt-2 w-48 shadow-lg rounded-lg p-2 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                {notifications.map((notification) => (
                  <div key={notification.id} className={`p-2 ${notification.isRead ? 'text-gray-500' : 'font-bold'}`} onClick={() => handleNotificationRead(notification.id)}>
                    {notification.message}
                  </div>
                ))}
              </div>
            )}
            <div className="relative">
              <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center space-x-2">
                <ion-icon name="person-outline"></ion-icon>
                <span>{username || 'User'}</span>
              </button>
              {dropdownOpen && (
                <div className={`absolute mt-2 w-48 shadow-lg rounded-lg p-2 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                  <Link to="/profile" className={`block px-4 py-2 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Profile</Link>
                  <button onClick={handleLogout} className={`block px-4 py-2 text-red-600`}>Logout</button>
                </div>
              )}
            </div>
            <button onClick={handleDarkModeToggle}>
              <ion-icon name={darkMode ? 'sunny-outline' : 'moon-outline'}></ion-icon>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-4">
        <div className="flex justify-between space-x-4">
          {/* Active Users */}
          <div className="w-1/4">
            <h2 className="text-lg font-semibold mb-4">Active Users</h2>
            <ul className="bg-white rounded-lg shadow p-4">
              {activeUsers.length > 0 ? (
                activeUsers.map((user) => (
                  <li key={user.id} className="border-b py-2">{user.username}</li>
                ))
              ) : (
                <li>No active users</li>
              )}
            </ul>
          </div>

          {/* Problem Posting Form */}
          <div className="flex-1">
            <h2 className="text-lg font-semibold mb-4">Post Your Problem</h2>
            <form onSubmit={handleProblemSubmit} className="bg-white rounded-lg shadow p-4 mb-4">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                className="border rounded-lg w-full mb-2 px-2 py-2"
                required
              />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
                className="border rounded-lg w-full mb-2 px-2 py-2"
                required
              />
              <button type="submit" className="bg-blue-600 text-white rounded-lg px-4 py-2">Submit</button>
            </form>

            {/* List of Active Problems */}
            <h2 className="text-lg font-semibold mb-4">Active Problems</h2>
            <ul className="bg-white rounded-lg shadow p-4">
              {loading ? (
                <li>Loading problems...</li>
              ) : (
                problems.map((problem) => (
                  <li key={problem.id} className="border-b py-2">
                    <Link to={`/problems/${problem.id}`} className="text-blue-600 hover:underline">{problem.title}</Link>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
