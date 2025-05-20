import React, { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from '../firebase';
import { ref, set } from "firebase/database";
import { useNavigate } from 'react-router-dom';

const Signup = ({ onBackToLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      // 1. Create user account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // 2. Update user profile with additional info
      await updateProfile(userCredential.user, {
        displayName: fullName,
        photoURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=random`
      });

      // 3. Save user info to Realtime Database
      await set(ref(db, `users/${userCredential.user.uid}`), {
        username: username,
        fullName: fullName,
        email: email,
        createdAt: new Date().toISOString(),
      });

      setSuccess('Account created successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(`Sign up failed: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500">
      <div className="bg-gray-700 bg-opacity-80 rounded-xl shadow-lg max-w-4xl w-full mx-4 md:flex overflow-hidden">
        {/* Left side image */}
        <div className="hidden md:block md:w-1/2">
          <img
            src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80"
            alt="Signup Visual"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Right side signup form */}
        <div className="w-full md:w-1/2 p-10 text-white">
          <h2 className="text-3xl font-semibold mb-8 text-center md:text-left">Sign Up</h2>
          <form onSubmit={handleSignup} className="space-y-6">
            <div>
              <label className="block mb-2 font-medium">Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                className="w-full px-4 py-2 rounded bg-gray-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">Username</label>
              <input
                type="text"
                placeholder="johndoe123"
                className="w-full px-4 py-2 rounded bg-gray-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">Email</label>
              <input
                type="email"
                placeholder="john.doe@email.com"
                className="w-full px-4 py-2 rounded bg-gray-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">Password</label>
              <input
                type="password"
                placeholder="Create a password"
                className="w-full px-4 py-2 rounded bg-gray-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            {error && <div className="text-red-400">{error}</div>}
            {success && <div className="text-green-400">{success}</div>}

            <button
              type="submit"
              className="w-full py-3 rounded bg-gray-800 hover:bg-gray-900 transition font-semibold"
            >
              Sign Up
            </button>
          </form>

          <button
            onClick={() => navigate('/login')} 
            className="block mx-auto mt-6 text-gray-300 hover:underline"
            type="button"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
