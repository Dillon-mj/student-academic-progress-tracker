import React, { useState } from 'react';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebase';

const Login = ({ onLogin, onSignup }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

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
    <div className="min-h-screen flex items-center justify-center bg-gray-200">
      <div className="bg-gray-400 rounded-xl p-10 w-full max-w-md shadow-lg">
        <h2 className="text-2xl font-semibold text-white mb-8">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-white mb-2">Email</label>
            <input
              type="email"
              placeholder="john.doe@email.com"
              className="w-full px-4 py-2 rounded bg-gray-200 text-gray-500 placeholder-gray-400 focus:outline-none"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div>
            <label className="block text-white mb-2">Password</label>
            <input
              type="password"
              placeholder="john@123"
              className="w-full px-4 py-2 rounded bg-gray-200 text-gray-500 placeholder-gray-400 focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="text-red-200">{error}</div>}
          <button
            type="submit"
            className="w-full py-2 rounded bg-gray-500 text-white font-semibold hover:bg-gray-600 transition"
          >
            Login
          </button>
        </form>
        <button
          onClick={onSignup}
          className="block mx-auto mt-6 text-gray-200 hover:underline"
          type="button"
        >
          Sign up
        </button>
      </div>
    </div>
  );
};

export default Login;
