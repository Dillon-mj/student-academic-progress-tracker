import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import DashboardLayout from './components/DashboardLayout';
import CoursesContent from './components/CoursesContent';
import AssessmentsContent from './components/AssessmentsContent';
import QuizResults from './components/QuizResults';
import Profile from './components/Profile';
import StudyPlan from './components/StudyPlan';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase';
import { ref, set } from 'firebase/database'; // Added
import { db } from './firebase'; // Added

const ProtectedRoute = ({ user }) => {
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to record login date
  const recordLoginDate = async (userId) => {
    try {
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
      const loginRef = ref(db, `attendance/${userId}/logins/${today}`);
      await set(loginRef, true);
    } catch (error) {
      console.error('Error recording login date:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, record login date
        recordLoginDate(user.uid);
      }
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={currentUser ? <Navigate to="/dashboard" replace /> : <Login />} />
        <Route path="/signup" element={currentUser ? <Navigate to="/dashboard" replace /> : <Signup />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute user={currentUser} />}>
          <Route path="/dashboard" element={<DashboardLayout onLogout={() => signOut(auth)} user={currentUser} />}>
            {/* Nested routes rendered inside DashboardLayout's <Outlet /> */}
            <Route index element={<DashboardLayout user={currentUser} />} />
            <Route path="courses" element={<CoursesContent user={currentUser} />} />
            <Route path="assessments" element={<AssessmentsContent user={currentUser} />} />
            <Route path="profile" element={<Profile user={currentUser} />} />
            <Route path="quiz-results" element={<QuizResults user={currentUser} />} />
            <Route path="study-plan" element={<StudyPlan user={currentUser} />} />
          </Route>
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to={currentUser ? "/dashboard" : "/login"} replace />} />
      </Routes>
    </Router>
  );
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