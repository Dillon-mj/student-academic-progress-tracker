import React, { useState } from 'react';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin, onSignup }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, username, password);
      onLogin(username, password);
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500">
      <div className="bg-gray-700 bg-opacity-80 rounded-xl shadow-lg max-w-4xl w-full mx-4 md:flex overflow-hidden">
        {/* Left side image */}
        <div className="hidden md:block md:w-1/2">
          <img
            src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80"
            alt="Login Visual"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Right side login form */}
        <div className="w-full md:w-1/2 p-10 text-white">
          <h2 className="text-3xl font-semibold mb-8 text-center md:text-left">Login</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-2 font-medium">Email</label>
              <input
                type="email"
                placeholder="john.doe@email.com"
                className="w-full px-4 py-2 rounded bg-gray-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoFocus
              />
            </div>
            <div>
              <label className="block mb-2 font-medium">Password</label>
              <input
                type="password"
                placeholder="john@123"
                className="w-full px-4 py-2 rounded bg-gray-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <div className="text-red-400">{error}</div>}
            <button
              type="submit"
              className="w-full py-3 rounded bg-gray-800 hover:bg-gray-900 transition font-semibold"
            >
              Login
            </button>
          </form>
          <button
            onClick={() => navigate('/signup')}
            className="block mx-auto mt-6 text-gray-300 hover:underline"
            type="button"
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
