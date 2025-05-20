import React, { useState, useEffect } from 'react';
import { ref, get, set } from "firebase/database";
import { db } from '../firebase';

function SelectCourses({ userId, onComplete }) {
  const [availableCourses, setAvailableCourses] = useState({});
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  // Fetch available courses
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setError(null);
      try {
        const coursesRef = ref(db, 'availableCourses');
        const snapshot = await get(coursesRef);
        setAvailableCourses(snapshot.val() || {});
      } catch (err) {
        setError('Failed to load courses. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleSelect = (courseId) => {
    setSelectedCourses(prev =>
      prev.includes(courseId)
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    );
  };

  const handleSubmit = async () => {
    if (selectedCourses.length === 0) {
      setError('Please select at least one course.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const coursesObj = {};
      selectedCourses.forEach(id => {
        coursesObj[id] = { ...availableCourses[id], marks: 0 };
      });
      await set(ref(db, `users/${userId}/courses`), coursesObj);
      setSuccessMsg('Courses saved successfully!');
      onComplete();
    } catch (err) {
      setError('Failed to save courses. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-600">
        Loading courses...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-8">
      {/* Landing / Intro Section */}
      <section className="flex flex-col md:flex-row items-center mb-10">
        {/* Text */}
        <div className="flex-1 md:pr-8 mb-6 md:mb-0">
          <h1 className="text-3xl font-bold text-gray-800 mb-3">
            Choose Your Courses
          </h1>
          <p className="text-gray-600 text-lg">
            Select the courses you want to enroll in this semester.  
            Tracking your academic progress starts here - pick your subjects wisely and stay on top of your goals!
          </p>
        </div>
        {/* Illustration */}
        <div className="flex-1 relative min-h-[280px]">
          <img
            src="https://images.pexels.com/photos/5553050/pexels-photo-5553050.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            alt="Courses Illustration"
            className="object-cover w-full h-full rounded-xl shadow-lg"
          />
        </div>
      </section>

      {/* Course Selection Form */}
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Select Your Courses</h2>

      {error && (
        <div className="mb-4 text-red-600 font-medium">
          {error}
        </div>
      )}

      {successMsg && (
        <div className="mb-4 text-green-600 font-medium">
          {successMsg}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-96 overflow-y-auto mb-6">
        {Object.entries(availableCourses).map(([id, course]) => (
          <label
            key={id}
            className="flex items-center space-x-3 cursor-pointer hover:bg-gray-100 rounded p-2"
          >
            <input
              type="checkbox"
              checked={selectedCourses.includes(id)}
              onChange={() => handleSelect(id)}
              className="form-checkbox h-5 w-5 text-gray-800"
            />
            <span className="text-gray-700">{course.name}</span>
          </label>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={saving}
        className={`w-full py-3 rounded bg-gray-800 text-white font-semibold hover:bg-gray-900 transition ${
          saving ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {saving ? 'Saving...' : 'Save Courses'}
      </button>
    </div>
  );
}

export default SelectCourses;
