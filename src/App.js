import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CoverPage from './components/CoverPage/CoverPage';
import LoginSignup from './components/LoginSignn/LoginSignup';
import ProblemPosting from './components/ProblemPosting/ProblemPosting'; // Import ProblemPosting
import HomePage from './components/Home/HomePage';
import SolutionPage from './components/Solution/SolutionPage';
import FollowerPage from './components/Followers/FollowerPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CoverPage />} />
        <Route path="/login" element={<LoginSignup />} />
        <Route path="/problem-posting" element={<ProblemPosting />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/solutions" element={<SolutionPage/>}/>
        <Route path="/followers" element={<FollowerPage/>}/>
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
