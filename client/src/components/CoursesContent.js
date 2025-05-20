import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SelectCourses from './SelectCourses'; // Adjust path if needed

const CoursesContent = ({ userCourses, user }) => {
  const [isSelecting, setIsSelecting] = useState(false);
  const navigate = useNavigate();

  if (isSelecting) {
    return (
      <SelectCourses
        userId={user.uid}
        onComplete={() => setIsSelecting(false)}
      />
    );
  }

  const hasSelectedCourses = Object.keys(userCourses || {}).length > 0;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Intro / Landing Section */}
      <section className="flex flex-col md:flex-row items-center bg-gradient-to-r from-gray-100 to-gray-50 rounded-xl p-8 mb-10 shadow-lg overflow-hidden">
        {/* Text */}
        <div className="flex-1 mb-6 md:mb-0 md:pr-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Your Courses
          </h1>
          <p className="text-gray-700 text-lg">
            Here you can view your current courses, track your progress, and select new courses to shape your academic journey. Stay organized and motivated!
          </p>
          <button
            onClick={() => setIsSelecting(true)}
            className="mt-6 bg-gray-800 text-white px-6 py-3 rounded shadow hover:bg-gray-900 transition"
          >
            Select Courses
          </button>
        </div>
        {/* Illustration */}
        <div className="flex-1 relative h-72 md:h-80">
          <img
            src="https://images.pexels.com/photos/8199159/pexels-photo-8199159.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            alt="Courses Illustration"
            className="object-cover w-full h-full rounded-xl shadow-lg"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/300x200?text=Image+Unavailable';
            }}
          />
        </div>
      </section>

      {/* Existing Courses List */}
      {hasSelectedCourses ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(userCourses).map(([courseId, course]) => (
              <div key={courseId} className="bg-white p-6 rounded-xl shadow">
                <h3 className="font-semibold text-lg">{course.name}</h3>
                <div className="mt-3 flex justify-between text-gray-600">
                  <span>Grade:</span>
                  <span className="font-medium">{course.marks || 'Not graded'}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Go to Assessments Button */}
          <div className="mt-8 text-center">
            <button
              onClick={() => navigate('/dashboard/assessments')}
              className="bg-green-600 text-white px-6 py-3 rounded shadow hover:bg-green-700 transition"
            >
              Go to Assessments
            </button>
          </div>
        </>
      ) : (
        <div className="text-center text-gray-500 bg-white p-6 rounded-xl shadow">
          <p>You haven't selected any courses yet.</p>
        </div>
      )}
    </div>
  );
};

export default CoursesContent;
