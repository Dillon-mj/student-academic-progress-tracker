import logo from './logo.svg';
import './App.css';
import Login from './components/Login';
import Signup from './components/Signup';
import DashboardLayout from './components/DashboardLayout';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom' ;
import { useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase';

function App() {
  const [page, setPage] = useState('login');
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setLoggedIn(!!user);
      setCurrentUser(user);
      if (user) setPage('dashboard');
      else setPage('login');
    });
    return unsubscribe;
  }, []);

  const handleLogin = () => setPage('dashboard');
  const handleSignup = () => setPage('signup');
  const handleBackToLogin = () => setPage('login');
  const handleLogout = () => signOut(auth);

  if (loggedIn && page === 'dashboard') {
    return <DashboardLayout onLogout={handleLogout} user={currentUser} />;
  }
  if (page === 'signup') {
    return <Signup onBackToLogin={handleBackToLogin} />;
  }
  return <Login onLogin={handleLogin} onSignup={handleSignup} />;
}

export default App;

/*
function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = (username, password) => {
    if (username && password) setLoggedIn(true);
  };

  const handleSignup = () => {};

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={loggedIn ? <DashboardLayout /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={<Login onLogin={handleLogin} onSignup={() => window.location.href = '/signup'} />}
        />
        <Route
          path="/signup"
          element={<Signup />} // Implement this component
        />
      </Routes>
    </Router>
  );
}

export default App;

/*function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  // Dummy authentication logic
  const handleLogin = (username, password) => {
    // TODO: Replace with real authentication
    if (username && password) setLoggedIn(true);
  };

  const handleSignup = () => {
    alert('Sign up functionality coming soon!');
  };

  return loggedIn ? (
    <DashboardLayout />
  ) : (
    <Login onLogin={handleLogin} onSignup={handleSignup} />
  );
}

export default App;*/

/*
function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = (username, password) => {
    // Add authentication logic here (for now, just log in)
    setLoggedIn(true);
  };

  const handleSignup = () => {
    // Handle sign up logic or navigate to a sign up page
    alert('Sign up functionality coming soon!');
  };

  return loggedIn ? (
    <DashboardLayout />
  ) : (
    <Login onLogin={handleLogin} onSignup={handleSignup} />
  );
}

export default App;



/*
function App() {
  return <DashboardLayout />;
}

export default App;*/

/*
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
*/