import React, { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Import Firestore

const Signup = ({ onBackToLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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

      await setDoc(doc(db, 'users', userCredential.user.uid), {
        username: username,
        fullName: fullName,
        email: email,
        createdAt: new Date(),
      });

      // 3. (Optional) Save extra data to Firestore
      // You would add Firestore code here

      setSuccess('Account created successfully! Redirecting...');
      setTimeout(() => onBackToLogin(), 2000);
    } catch (err) {
      setError(`Sign up failed: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200">
      <div className="bg-gray-400 rounded-xl p-10 w-full max-w-md shadow-lg">
        <h2 className="text-2xl font-semibold text-white mb-8">Sign Up</h2>
        <form onSubmit={handleSignup} className="space-y-6">
          <div>
            <label className="block text-white mb-2">Full Name</label>
            <input
              type="text"
              placeholder="John Doe"
              className="w-full px-4 py-2 rounded bg-gray-200 text-gray-500 placeholder-gray-400 focus:outline-none"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-white mb-2">Username</label>
            <input
              type="text"
              placeholder="johndoe123"
              className="w-full px-4 py-2 rounded bg-gray-200 text-gray-500 placeholder-gray-400 focus:outline-none"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-white mb-2">Email</label>
            <input
              type="email"
              placeholder="john.doe@email.com"
              className="w-full px-4 py-2 rounded bg-gray-200 text-gray-500 placeholder-gray-400 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-white mb-2">Password</label>
            <input
              type="password"
              placeholder="Create a password"
              className="w-full px-4 py-2 rounded bg-gray-200 text-gray-500 placeholder-gray-400 focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          {error && <div className="text-red-200">{error}</div>}
          {success && <div className="text-green-200">{success}</div>}

          <button
            type="submit"
            className="w-full py-2 rounded bg-gray-500 text-white font-semibold hover:bg-gray-600 transition"
          >
            Sign Up
          </button>
        </form>

        <button
          onClick={onBackToLogin}
          className="block mx-auto mt-6 text-gray-200 hover:underline"
          type="button"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default Signup;
