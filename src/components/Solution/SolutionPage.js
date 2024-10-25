import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import Comment from "../Comment/Comment";
import "./SolutionPage.css";

const SolutionsPage = () => {
  const [problems, setProblems] = useState([]);
  const [solutions, setSolutions] = useState([]);
  const [currentUser, setCurrentUser] = useState("");
  const [selectedProblemId, setSelectedProblemId] = useState(null);
  const [selectedProblem, setSelectedProblem] = useState(null); // Add this line
  const [solutionText, setSolutionText] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("PENDING");
  const [editSolutionId, setEditSolutionId] = useState(null);
  const [editSolutionModalOpen, seteditSolutionModalOpen] = useState(false);
  const [editStatusModalOpen, seteditStatusModalOpen] = useState(false);
  const [isCommentVisible, setIsCommentVisible] = useState(false);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedDarkMode = localStorage.getItem("darkMode") === "true";
    const storedUsername = localStorage.getItem("username");
    setToken(storedToken);
    setDarkMode(storedDarkMode);
    setCurrentUser(storedUsername);
  }, []);

  const fetchAllProblems = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/problems", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      setProblems(data);
    } catch (error) {
      console.error("Error fetching problems:", error);
      setErrorMessage("Failed to fetch problems. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchAllProblems();
  }, [fetchAllProblems]);

  const fetchSolutionsForProblem = useCallback(
    async (problemId) => {
      if (!token) return;

      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:8080/api/solutions/problem/${problemId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok)
          throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        setSolutions(data); // Make sure this data includes upvote and downvote counts      
      } catch (error) {
        console.error("Error fetching solutions:", error);
        setErrorMessage("Failed to fetch solutions. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  const handleProblemSelect = async (problemId) => {
    setSelectedProblemId(problemId);
    fetchSolutionsForProblem(problemId);

    // Fetch the problem details
    const response = await fetch(
      `http://localhost:8080/api/problems/${problemId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      const problemData = await response.json();
      setSelectedProblem(problemData); // Set the selected problem details
    }
  };

  const handleUpdateStatus = (newStatus) => {
    setSelectedStatus(newStatus);
  };
  
  
  const handleSolutionSubmit = async (e) => {
    e.preventDefault();
    if (!token || !selectedProblemId) {
      setErrorMessage("No token or problem selected!");
      return;
    }

    const solutionData = { description: solutionText, username: currentUser,status: 'PENDING' };

    try {
      const response = await fetch(
        `http://localhost:8080/api/solutions/problem/${selectedProblemId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(solutionData),
        }
      );

      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);

      const result = await response.json();
      setSolutions((prevSolutions) => [...prevSolutions, result]);
      setSolutionText("");
      setErrorMessage("");
    } catch (error) {
      console.error("Error during solution creation:", error);
      setErrorMessage("Failed to post solution. Please try again.");
    }
  };

  const handleOpeneditSolutionModal = (solution) => {
    setEditSolutionId(solution.id);
    setSolutionText(solution.description);
    setSelectedStatus(solution.status); // Add this line to prefill status
    seteditSolutionModalOpen(true);
  };

  const handleOpeneditStatusModal = (solution) => {
    setEditSolutionId(solution.id);
    setSelectedStatus(solution.status); // Add this line to prefill status
    seteditStatusModalOpen(true);
  };
  
  const handleUpdateSolutionStatus = async (e) => {
    e.preventDefault();
    if (!token || !editSolutionId) return;

    const solutionData = { status: selectedStatus};

    try {
      const response = await fetch(
        `http://localhost:8080/api/solutions/${editSolutionId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(solutionData),
        }
      );

      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);

      const updatedSolution = await response.json();
      setSolutions((prevSolutions) =>
        prevSolutions.map((sol) =>
          sol.id === updatedSolution.id ? updatedSolution : sol
        )
      );
      closeEditStatusModal();
    } catch (error) {
      console.error("Error updating solution:", error);
      setErrorMessage("Failed to update solution. Please try again.");
    }
  };

  const handleUpdateSolution = async (e) => {
    e.preventDefault();
    if (!token || !editSolutionId) return;

    const solutionData = { description: solutionText};

    try {
      const response = await fetch(
        `http://localhost:8080/api/solutions/${editSolutionId}/description`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(solutionData),
        }
      );

      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);

      const updatedSolution = await response.json();
      setSolutions((prevSolutions) =>
        prevSolutions.map((sol) =>
          sol.id === updatedSolution.id ? updatedSolution : sol
        )
      );
      closeEditSolutionModal();
    } catch (error) {
      console.error("Error updating solution:", error);
      setErrorMessage("Failed to update solution. Please try again.");
    }
  };

  const handleDeleteSolution = async (solutionId) => {
    if (!token) return;

    try {
      const response = await fetch(
        `http://localhost:8080/api/solutions/${solutionId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);

      setSolutions((prevSolutions) =>
        prevSolutions.filter((sol) => sol.id !== solutionId)
      );
      setErrorMessage("");
    } catch (error) {
      console.error("Error deleting solution:", error);
      setErrorMessage("Failed to delete solution. Please try again.");
    }
  };

  const handleVote = async (solutionId, voteType) => {
    if (!token) return;

    try {
      const response = await fetch(
        `http://localhost:8080/api/votes/solution/${solutionId}?voteType=${voteType.toUpperCase()}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);

      // Fetch the updated solution data to refresh the vote counts
      await fetchSolutionsForProblem(selectedProblemId);
    } catch (error) {
      console.error("Error voting on solution:", error);
      setErrorMessage("Failed to vote. Please try again.");
    }
  };

  const handleCommentDropdown = () => {
    setIsCommentVisible(prevState => !prevState);
  };

  const handleDarkModeToggle = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", newDarkMode);
  };

  const handleDropdownToggle = () => setDropdownOpen(!dropdownOpen);

  const closeEditSolutionModal = () => {
    seteditSolutionModalOpen(false);
    setEditSolutionId(null);
    setSolutionText("");
    setErrorMessage("");
  };

  const closeEditStatusModal = () => {
    seteditStatusModalOpen(false);
    setEditSolutionId(null);
    setErrorMessage("");
  };

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-gray-900 text-gray-100" : "bg-green-200 text-gray-900"
      }`}
    >
      {/* Header */}
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

      {/* Main Content */}
      <div className="grid grid-cols-12 gap-6 max-w-7xl mx-auto py-6">
        {/* Left: Problem List */}
        <aside
          className={`col-span-4 rounded-lg shadow p-4 ${
            darkMode ? "bg-gray-800" : "bg-white"
          } maxHeight overflow-y-scroll`}
        >
          <h2 className="text-xl font-bold">Problems</h2>
          {loading ? (
            <p>Loading...</p>
          ) : problems.length === 0 ? (
            <p>No problems available.</p> // Placeholder content
          ) : (
            <ul>
              {problems.map((problem) => (
                <li
                  key={problem.id}
                  className={`cursor-pointer transition transform hover:scale-105 hover:shadow-lg hover:bg-gray-200 p-2  ${
                    darkMode ? "hover:bg-gray-600" : "hover:bg-gray-200"
                  }`}
                  onClick={() => handleProblemSelect(problem.id)}
                >
                  {problem.title}
                </li>
              ))}
            </ul>
          )}
        </aside>

        {/* Right: Solutions Section */}
        <main
          className={`col-span-8 rounded-lg shadow p-4 ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <h2 className="text-xl font-bold">Solutions</h2>
          {selectedProblemId ? (
            <>
              {/* Display Problem Details */}
              {selectedProblem && (
                <div className="mb-4 p-4 border border-gray-300 rounded">
                  <h3 className="text-lg font-semibold">
                    {selectedProblem.title}
                  </h3>
                  <p>{selectedProblem.description}</p>
                </div>
              )}
              {solutions.length > 0 ? (
                <ul className="mt-4 max-h-60 overflow-y-scroll">
                  {solutions.map((solution) => (
                    <li
                      key={solution.id}
                      className="border-b border-gray-300 pb-2 mb-2"
                    >
                      <p>{solution.description}</p>
                      <p className="text-sm text-gray-500">
                        by {solution.username}
                      </p>
                      <div className="flex items-center space-x-4">
                      <p>Status: {solution.status}</p>
                      <span>
                        wanna update status ?
                        <button
                          onClick={() => handleOpeneditStatusModal(solution)}
                          className="p-1 text-yellow-400 hover:underline"
                        >
                          Edit
                        </button>
                      </span>
                      </div>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-gray-600">
                          <button
                            onClick={() => handleVote(solution.id, "upvote")}
                            className="text-blue-500"
                          >
                            {/* Upvote */}
                            <ion-icon name="thumbs-up-sharp"></ion-icon>
                          </button>
                          <span className="px-1">
                            {solution.upvoteCount || 0}
                          </span>
                        </span>
                        <span className="text-gray-600">
                          <button
                            onClick={() => handleVote(solution.id, "downvote")}
                            className="text-red-500"
                          >
                            {/* Down Vote */}
                          <ion-icon name="thumbs-down-sharp"></ion-icon>
                          </button>
                          <span className="px-1">
                            {solution.downvoteCount || 0}
                          </span>
                        </span>
                        <button
                          onClick={() => handleOpeneditSolutionModal(solution)}
                          className="text-yellow-500"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteSolution(solution.id)}
                          className="text-red-500"
                        >
                          Delete
                        </button>
                      </div>
                      <p
                        onClick={handleCommentDropdown}
                        className="text-green-500 cursor-pointer hover:text-green-700 transition-all duration-300 hover:underline ease-in-out"
                      >
                        Add your thoughts
                      </p>
                      {/* Conditionally render the Comment component */}
                      {isCommentVisible && <Comment solutionId={solution.id} currentUser={currentUser} />}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No solutions yet for this problem.</p>
              )}
              <form onSubmit={handleSolutionSubmit} className="mt-1 p-1">
                <textarea
                  className={`w-full rounded-lg border p-2 ${
                    darkMode
                      ? "bg-gray-700 text-gray-100"
                      : "bg-white text-gray-900"
                  }`}
                  value={solutionText}
                  onChange={(e) => setSolutionText(e.target.value)}
                  placeholder="Write your solution..."
                  required
                />
                <button
                  type="submit"
                  className={`mt-2 rounded-lg py-2 px-4 transition-colors duration-300 transition transform hover:scale-105 hover:shadow-lg ${
                    darkMode
                      ? "bg-green-600 text-gray-100"
                      : "bg-green-500 text-white"
                  }`}
                >
                  Submit Solution
                </button>
              </form>
            </>
          ) : (
            <p>Select a problem to view solutions.</p>
          )}

          {/* Edit Solution Modal */}
          {editSolutionModalOpen && (
            <div
              className={`fixed inset-0 flex items-center justify-center p-4 transition-opacity duration-300 ${
                darkMode ? "bg-gray-900 bg-opacity-80" : "bg-gray-100 bg-opacity-80"
              }`}
            >
              <div
                className={`w-full max-w-lg mx-auto bg-white rounded-xl shadow-2xl p-6 transform transition-transform duration-300 ${
                  darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"
                }`}
              >
                <h3 className="text-xl font-semibold mb-4">Edit Solution</h3>
                <form onSubmit={handleUpdateSolution}>
                  <textarea
                    className={`w-full h-32 rounded-md border p-3 outline-none focus:ring-2 transition-all duration-300 ${
                      darkMode
                        ? "bg-gray-700 text-gray-100 border-gray-600 focus:ring-blue-600"
                        : "bg-white text-gray-900 border-gray-300 focus:ring-blue-500"
                    }`}
                    value={solutionText}
                    onChange={(e) => setSolutionText(e.target.value)}
                    placeholder="Edit your solution here..."
                    required
                  />
                  <div className="flex justify-end gap-4 mt-6">
                    <button
                      type="button"
                      className={`rounded-md px-5 py-2 font-medium transition-colors duration-300 border ${
                        darkMode
                          ? "bg-gray-700 text-gray-200 border-gray-500 hover:bg-gray-600"
                          : "bg-gray-300 text-gray-800 border-gray-300 hover:bg-gray-400"
                      }`}
                      onClick={closeEditSolutionModal}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className={`rounded-md px-5 py-2 font-medium transition-colors duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                        darkMode
                          ? "bg-blue-600 text-gray-100 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-gray-900"
                          : "bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-400 focus:ring-offset-white"
                      }`}
                    >
                      Update Solution
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {editStatusModalOpen && (
            <div
              className={`fixed inset-0 flex items-center justify-center p-4 transition-opacity duration-300 ${
                darkMode ? "bg-gray-900 bg-opacity-80" : "bg-gray-100 bg-opacity-80"
              }`}
            >
              <div
                className={`w-full max-w-lg mx-auto bg-white rounded-xl shadow-2xl p-6 transform transition-transform duration-300 ${
                  darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"
                }`}
              >
                <h3 className="text-xl font-semibold mb-4">Edit Status</h3>
                <form onSubmit={handleUpdateSolutionStatus} className="p-4">
                        <div className="flex items-center space-x-2">
                          <label className="text-gray-700 font-bold" htmlFor="status">
                            Status:
                          </label>
                          <select
                            id="status"
                            placeholder="Select solution status..."
                            value={selectedStatus}
                            onChange={(e) => handleUpdateStatus(e.target.value)}
                            className={`flex-grow border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${ darkMode
                              ? "bg-gray-700 text-gray-200 border-gray-500 hover:bg-gray-600"
                              : "bg-white text-gray-800 border-gray-300 hover:bg-gray-50"
                          }`}
                          >
                            <option value="PENDING">Pending</option>
                            <option value="ACCEPTED">Accepted</option>
                            <option value="REJECTED">Rejected</option>
                          </select>
                        </div>
                        <div className="flex mt-2 space-x-2">
                        <button
                      type="button"
                      className={`rounded-md px-5 py-2 font-medium transition-colors duration-300 border ${
                        darkMode
                          ? "bg-gray-700 text-gray-200 border-gray-500 hover:bg-gray-600"
                          : "bg-white-300 text-gray-800 border-gray-300 hover:bg-gray-400"
                      }`}
                      onClick={closeEditStatusModal}
                    >
                      Cancel
                    </button>
                          <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
                          >
                            Submit
                          </button>
                        </div>
                </form>
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        </main>
      </div>
    </div>
  );
};

export default SolutionsPage;
