import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";

const ProblemPage = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [problems, setProblems] = useState([]);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState(null);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUsername = localStorage.getItem("username");
    setToken(storedToken);
    setUsername(storedUsername);
  }, []);

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

  useEffect(() => {
    fetchAllProblems();
  }, [fetchAllProblems]);

  const handleProblemSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      console.error("No token found!");
      return;
    }
    const problemData = { title, description };
    try {
      const method = selectedProblem ? "PUT" : "POST";
      const url = selectedProblem
        ? `http://localhost:8080/api/problems/${selectedProblem.id}`
        : "http://localhost:8080/api/problems";

      const response = await fetch(url, {
        method,
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
      setProblems((prevProblems) =>
        selectedProblem
          ? prevProblems.map((p) => (p.id === result.id ? result : p))
          : [...prevProblems, result]
      );
      setTitle("");
      setDescription("");
      setSelectedProblem(null);
    } catch (error) {
      console.error("Error during problem creation/update:", error);
    }
  };

  const handleUpdate = (problem) => {
    setTitle(problem.title);
    setDescription(problem.description);
    setSelectedProblem(problem);
  };

  const handleDelete = async (id) => {
    if (!token) {
      console.error("No token found!");
      return;
    }
    try {
      const response = await fetch(`http://localhost:8080/api/problems/${id}`, {
        method: "DELETE",
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
      setProblems((prevProblems) =>
        prevProblems.filter((problem) => problem.id !== id)
      );
    } catch (error) {
      console.error("Error during problem deletion:", error);
    }
  };

  const handleDarkModeToggle = () => {
    setDarkMode((prevMode) => !prevMode);
  };
  const handleDropdownToggle = () => setDropdownOpen(!dropdownOpen);

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-gray-900 text-green-50" : "bg-green-200 text-black"
      }`}
    >
      <header
        className={`bg-white shadow ${
          darkMode ? "bg-gray-800 text-gray-100" : "bg-white"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
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
            <nav className="hidden md:flex space-x-4">
              <Link
                to="/home"
                className={`${darkMode ? "text-green-400" : "text-gray-700"}`}
              >
                Home
              </Link>
              <Link
                to="/solutions"
                className={`${darkMode ? "text-green-400" : "text-gray-700"}`}
              >
                Solutions
              </Link>
              <Link
                to="/problems"
                className={`${darkMode ? "text-green-400" : "text-gray-700"}`}
              >
                Problems
              </Link>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
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

      <div className="flex flex-col md:flex-row max-w-7xl mx-auto p-4">
        <aside
          className={`rounded-lg shadow p-4 ${
            darkMode ? "bg-gray-800" : "bg-white"
          } w-full md:w-1/3 lg:w-2/5 mb-4 md:mb-0`}
        >
          <h2 className="text-xl font-bold">Problems</h2>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ul className="space-y-4">
              {problems.map((problem) => (
                <li
                  key={problem.id}
                  className={`${
                    darkMode ? "bg-gray-500" : "bg-white"
                  } border rounded p-4`}
                >
                  <h4 className="text-xl font-semibold mb-2">
                    {problem.title}
                  </h4>
                  <p className="text-gray-300 mb-2">{problem.description}</p>
                  <span className="text-gray-400 text-sm">
                    Posted by: {problem.user?.username || "Unknown"}
                  </span>
                  <div className="flex justify-end mt-4 space-x-2">
                    {username === problem.user?.username && (
                      <>
                        <button
                          onClick={() => handleUpdate(problem)}
                          className="text-yellow-500"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(problem.id)}
                          className="text-red-500"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </aside>

        <main
          className={`w-full md:w-2/3 p-6 rounded-lg shadow-lg ${
            darkMode ? "bg-gray-700" : "bg-white"
          }`}
        >
          <h3 className="text-2xl font-bold mb-4">
            {selectedProblem ? "Update Problem" : "Post a Problem"}
          </h3>
          <form onSubmit={handleProblemSubmit} className="space-y-4">
            <div className="flex flex-col mb-4">
              <label htmlFor="title" className="text-sm font-medium mb-2">
                Title:
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className={`${
                  darkMode ? "bg-gray-800" : "bg-white"
                } border border-gray-600 text-${
                  darkMode ? "green-50" : "black"
                } p-2 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
              />
            </div>
            <div className="flex flex-col mb-4">
              <label htmlFor="description" className="text-sm font-medium mb-2">
                Description:
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className={`${
                  darkMode ? "bg-gray-800" : "bg-white"
                } border border-gray-600 text-${
                  darkMode ? "green-50" : "black"
                } p-2 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
              />
            </div>
            <button
              type="submit"
              className={`border-2 border-green-500 text-green-500 font-bold py-2 px-4 rounded-lg transition-colors hover:bg-green-500 hover:text-white`}
            >
              {selectedProblem ? "Update Problem" : "Post Problem"}
            </button>
          </form>
        </main>
      </div>
    </div>
  );
};

export default ProblemPage;
