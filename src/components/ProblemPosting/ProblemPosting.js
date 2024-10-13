import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const ProblemPosting = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [problems, setProblems] = useState([]);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');
    setToken(storedToken);
    setUsername(storedUsername);
  }, []);

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

  useEffect(() => {
    fetchAllProblems();
  }, [fetchAllProblems]);

  const handleProblemSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      console.error('No token found!');
      return;
    }
    const problemData = { title, description };
    try {
      const method = selectedProblem ? 'PUT' : 'POST';
      const url = selectedProblem
        ? `http://localhost:8080/api/problems/${selectedProblem.id}`
        : 'http://localhost:8080/api/problems';

      const response = await fetch(url, {
        method,
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
      setProblems((prevProblems) =>
        selectedProblem
          ? prevProblems.map((p) => (p.id === result.id ? result : p))
          : [...prevProblems, result]
      );
      setTitle('');
      setDescription('');
      setSelectedProblem(null);
    } catch (error) {
      console.error('Error during problem creation/update:', error);
    }
  };

  const handleUpdate = (problem) => {
    setTitle(problem.title);
    setDescription(problem.description);
    setSelectedProblem(problem);
  };

  const handleDelete = async (id) => {
    if (!token) {
      console.error('No token found!');
      return;
    }
    try {
      const response = await fetch(`http://localhost:8080/api/problems/${id}`, {
        method: 'DELETE',
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
      setProblems((prevProblems) => prevProblems.filter((problem) => problem.id !== id));
    } catch (error) {
      console.error('Error during problem deletion:', error);
    }
  };

  return (
    <section className="min-h-screen w-full p-4 bg-gray-800 text-white flex flex-col items-center justify-center">
      <div className="w-full max-w-6xl">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate('/home')}
            className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors"
          >
            Back to Home
          </button>
          <h2 className="text-3xl font-bold">
            {selectedProblem ? 'Update Problem' : 'Create a New Problem'}
          </h2>
        </div>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/3 bg-gray-700 p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold mb-4">Post a Problem</h3>
            {loading && <div className="text-center py-4">Loading...</div>}
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
                  className="bg-gray-900 border border-gray-600 text-white p-2 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
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
                  className="bg-gray-900 border border-gray-600 text-white p-2 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
              >
                {selectedProblem ? 'Update Problem' : 'Post Problem'}
              </button>
            </form>
          </div>

          <div className="w-full md:w-2/3 bg-gray-700 p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold mb-4">All Problems</h3>
            <ul className="space-y-4">
              {problems.map((problem) => (
                <li key={problem.id} className="bg-gray-600 p-4 rounded-lg shadow-md border border-gray-500">
                  <h4 className="text-xl font-semibold mb-2">{problem.title}</h4>
                  <p className="text-gray-300 mb-2">{problem.description}</p>
                  <span className="text-gray-400 text-sm">Posted by: {problem.user?.username || 'Unknown'}</span>
                  <div className="flex justify-end mt-4 space-x-2">
                    {username === problem.user?.username && (
                      <>
                        <button
                          onClick={() => handleUpdate(problem)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded-lg transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(problem.id)}
                          className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-lg transition-colors"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemPosting;
