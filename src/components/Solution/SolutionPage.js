import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";

const SolutionsPage = () => {
  const [problems, setProblems] = useState([]);
  const [solutions, setSolutions] = useState([]);
  const [currentUser, setCurrentUser] = useState("");
  const [selectedProblemId, setSelectedProblemId] = useState(null);
  const [selectedProblem, setSelectedProblem] = useState(null); // Add this line
  const [solutionText, setSolutionText] = useState("");
  const [editSolutionId, setEditSolutionId] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
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

  const handleSolutionSubmit = async (e) => {
    e.preventDefault();
    if (!token || !selectedProblemId) {
      setErrorMessage("No token or problem selected!");
      return;
    }

    const solutionData = { description: solutionText, username: currentUser };

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

  const handleOpenEditModal = (solution) => {
    setEditSolutionId(solution.id);
    setSolutionText(solution.description);
    setEditModalOpen(true);
  };

  const handleUpdateSolution = async (e) => {
    e.preventDefault();
    if (!token || !editSolutionId) return;

    const solutionData = { description: solutionText };

    try {
      const response = await fetch(
        `http://localhost:8080/api/solutions/${editSolutionId}`,
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
      closeEditModal();
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

  const handleDarkModeToggle = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", newDarkMode);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setEditSolutionId(null);
    setSolutionText("");
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
            <nav className="space-x-4">
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
            <input
              type="text"
              placeholder="Search..."
              className={`border rounded-lg px-4 py-2 ${
                darkMode
                  ? "bg-gray-700 text-gray-100 border-gray-600"
                  : "bg-white text-gray-900"
              }`}
            />
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
          }`}
        >
          <h2 className="text-xl font-bold">Problems</h2>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ul>
              {problems.map((problem) => (
                <li
                  key={problem.id}
                  className={`cursor-pointer hover:bg-gray-200 ${
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
          <h2 className="text-xl font-bold">Problems</h2>
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
              <h2 className="text-xl font-bold">Solutions</h2>
              {solutions.length > 0 ? (
                <ul className="mt-4">
                  {solutions.map((solution) => (
                    <li
                      key={solution.id}
                      className="border-b border-gray-300 pb-2 mb-2"
                    >
                      <p>{solution.description}</p>
                      <p className="text-sm text-gray-500">
                        by {solution.username}
                      </p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-gray-600">
                          <button
                            onClick={() => handleVote(solution.id, "upvote")}
                            className="text-blue-500"
                          >
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
                            👎
                          </button>
                          {solution.downvoteCount || 0}
                        </span>
                        <button
                          onClick={() => handleOpenEditModal(solution)}
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
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No solutions yet for this problem.</p>
              )}
              <form onSubmit={handleSolutionSubmit}>
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
                  className={`mt-2 rounded-lg py-2 px-4 transition-colors duration-300 ${
                    darkMode
                      ? "bg-blue-600 text-gray-100"
                      : "bg-blue-500 text-white"
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
          {editModalOpen && (
            <div
              className={`fixed inset-0 flex items-center justify-center ${
                darkMode
                  ? "bg-gray-900 bg-opacity-75"
                  : "bg-gray-100 bg-opacity-75"
              }`}
            >
              <div
                className={`bg-white rounded-lg shadow-lg p-6 ${
                  darkMode ? "bg-gray-800 text-gray-100" : "bg-white"
                }`}
              >
                <h3 className="text-lg font-bold">Edit Solution</h3>
                <form onSubmit={handleUpdateSolution}>
                  <textarea
                    className={`w-full rounded-lg border p-2 ${
                      darkMode
                        ? "bg-gray-700 text-gray-100"
                        : "bg-white text-gray-900"
                    }`}
                    value={solutionText}
                    onChange={(e) => setSolutionText(e.target.value)}
                    required
                  />
                  <div className="flex justify-between mt-4">
                    <button
                      type="button"
                      className={`bg-gray-300 rounded-lg px-4 py-2 ${
                        darkMode ? "text-gray-900" : "text-gray-800"
                      }`}
                      onClick={closeEditModal}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className={`rounded-lg py-2 px-4 transition-colors duration-300 ${
                        darkMode
                          ? "bg-blue-600 text-gray-100"
                          : "bg-blue-500 text-white"
                      }`}
                    >
                      Update Solution
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
