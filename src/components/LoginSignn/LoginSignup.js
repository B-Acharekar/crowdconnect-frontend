import React, { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import './LoginSignup.css';
import user_icon from '../../assets/img/person.png';
import email_icon from '../../assets/img/email.png';
import password_icon from '../../assets/img/password.png';

const LoginSignup = () => {
  const [action, setAction] = useState('Login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('USER'); // Default role
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [progressWidth, setProgressWidth] = useState(100);
  const [transitionKey, setTransitionKey] = useState(Date.now());
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    let interval;
    if (showToast) {
      setProgressWidth(0);
      interval = setInterval(() => {
        setProgressWidth((prev) => (prev < 100 ? prev + 5 : 100));
      }, 100);

      setTimeout(() => {
        setShowToast(false);
        clearInterval(interval);
        if (action === 'Login') navigate('/home');
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [showToast, action, navigate]);

  const handleSubmit = async () => {
    setErrorMessage('');
    setShowToast(false);

    if (action === 'Login') {
      const loginData = { username, password };
      try {
        const response = await fetch('http://localhost:8080/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(loginData),
        });

        const result = await response.json();
        if (response.ok) {
          localStorage.setItem('token', result.token);
          localStorage.setItem('username', username);
          setToastMessage('Login successful!');
          setShowToast(true);
        } else {
          setErrorMessage(result.message || 'Login failed');
          setTimeout(() => setErrorMessage(''), 1500);
        }
      } catch (error) {
        setErrorMessage('Error during login');
        console.error('Error during login:', error);
      }
    } else {
      const signupData = { username, email, password, role };
      try {
        const response = await fetch('http://localhost:8080/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(signupData),
        });

        const result = await response.json();
        if (response.ok) {
          setToastMessage('Sign-up successful!');
          setShowToast(true);
          setTimeout(() => {
            setAction('Login');
            setTransitionKey(Date.now());
          }, 2100);
        } else {
          setErrorMessage(result.message || 'Sign-up failed');
          setTimeout(() => setErrorMessage(''), 1500);
        }
      } catch (error) {
        setErrorMessage('Error during sign-up');
        console.error('Error during sign-up:', error);
      }
    }
  };

  return (
<div className="min-h-screen bg-gradient-to-r from-green-500 to-blue-400 flex flex-col items-center justify-center transition-all duration-500 ease-in-out">
  <CSSTransition
    in={action === 'Login' || action === 'Sign Up'}
    timeout={500}
    classNames="fade"
    key={transitionKey}
    unmountOnExit
  >
    <div className="w-full max-w-md p-8 rounded-lg shadow-lg bg-white transition-transform duration-500 ease-in-out">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">{action}</h1>
        <div className="h-1 w-24 bg-green-500 rounded-full mx-auto mt-2"></div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center  border-gray-300 pb-2">
          <img src={user_icon} alt="User Icon" className="mr-2" />
          <input
            id="username"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-green-500 transition-all duration-300"
            aria-label="Username"
          />
        </div>

        {action === 'Sign Up' && (
          <>
            <div className="flex items-center border-gray-300 pb-2">
              <img src={email_icon} alt="Email Icon" className="mr-2" />
              <input
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-green-500 transition-all duration-300"
                aria-label="Email"
              />
            </div>

            <div className="flex items-center justify-between">
              <label htmlFor="role" className="text-gray-600 p-1 mr-4">Role</label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-green-500 transition-all duration-300"
                aria-label="Role"
              >
                <option value="USER">User</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>

            
          </>
        )}

        <div className="flex items-center border-gray-300 pb-2">
          <img src={password_icon} alt="Password Icon" className="mr-2" />
          <input
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-green-500 transition-all duration-300"
            aria-label="Password"
          />
        </div>

        {action === 'Login' && (
          <div className="text-right text-sm text-gray-500">
            <a href="/">Forgot password?</a>
          </div>
        )}
      </div>

      {errorMessage && (
        <div className="mt-4 text-red-500 text-center font-semibold">
          {errorMessage}
        </div>
      )}

      <div className="mt-4 text-center">
        {action === 'Login' ? (
          <p className="text-gray-500">
            Don't have an account?{' '}
            <button className="text-green-500 hover:underline" onClick={() => setAction('Sign Up')}>
              Create one
            </button>
          </p>
        ) : (
          <p className="text-gray-500">
            Already have an account?{' '}
            <button className="text-green-500 hover:underline" onClick={() => setAction('Login')}>
              Login
            </button>
          </p>
        )}
      </div>

      <div className="mt-4">
        <button
          className="w-full py-2 px-4 rounded-md text-white font-bold bg-green-500 hover:bg-green-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50"
          onClick={handleSubmit}
        >
          {action}
        </button>
      </div>
    </div>
  </CSSTransition>

  {showToast && (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded shadow-lg">
      {toastMessage}
      <div className="mt-2 w-full h-1 bg-green-300">
        <div
          className="h-full bg-green-500"
          style={{ width: `${progressWidth}%`, transition: 'width 0.1s linear' }}
        ></div>
      </div>
    </div>
  )}
</div>




  );
};

export default LoginSignup;
