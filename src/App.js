import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CoverPage from './components/CoverPage/CoverPage';
import Login from './components/LoginSignn/Login'; // Import Login Component
import SignUp from './components/LoginSignn/SignUp'; // Import SignUp Component
import ProblemPage from './components/ProblemPage/ProblemPage'; // Import ProblemPosting
import HomePage from './components/Home/HomePage';
import SolutionPage from './components/Solution/SolutionPage';
import ForgotPassword from './components/LoginSignn/ForgotPassword';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CoverPage />} />
        <Route path="/login" element={<Login />}/>
        <Route path="/signup" element={<SignUp/>}/>
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/problems" element={<ProblemPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/solutions" element={<SolutionPage/>}/>
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
