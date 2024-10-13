import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CoverPage from './components/CoverPage/CoverPage';
import LoginSignup from './components/LoginSignn/LoginSignup';
import ProblemPage from './components/ProblemPage/ProblemPage'; // Import ProblemPosting
import HomePage from './components/Home/HomePage';
import SolutionPage from './components/Solution/SolutionPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CoverPage />} />
        <Route path="/login" element={<LoginSignup />} />
        <Route path="/problems" element={<ProblemPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/solutions" element={<SolutionPage/>}/>
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
