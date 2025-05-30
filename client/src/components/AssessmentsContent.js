import React, { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebase';
import RandomQuiz from './RandomQuiz';
import { useNavigate } from 'react-router-dom'; // <-- Import useNavigate

const courseIdMap = {
  SE: 'softwareEngineering',
  CN: 'computerNetworks',
  CS: 'computerScience',
  DS: 'dataStructures',
  // Add other mappings as needed
};

const AssessmentsContent = ({ userCourses, user }) => {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [results, setResults] = useState({});
  const [loadingResults, setLoadingResults] = useState(true);
  const navigate = useNavigate(); // <-- Initialize navigate

  // Fetch quiz results for the logged-in user from Firebase
  useEffect(() => {
    if (!user?.uid) return;

    const resultsRef = ref(db, `userResults/${user.uid}`);
    const unsubscribe = onValue(resultsRef, (snapshot) => {
      setResults(snapshot.val() || {});
      setLoadingResults(false);
    });

    return () => unsubscribe();
  }, [user]);

  // Render the quiz component if a course is selected
  if (selectedCourse) {
    return (
      <RandomQuiz
        userId={user.uid}
        courseId={selectedCourse}
        numQuestions={10}
        timeLimit={600}
        onComplete={() => setSelectedCourse(null)} // Return to assessments on quiz completion
      />
    );
  }

  // List of courses the user is enrolled in
  const availableCourses = Object.keys(userCourses || {});

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Landing/Intro Section */}
      <section
        className="flex flex-col md:flex-row rounded-xl mb-10 shadow-lg overflow-hidden"
        style={{ minHeight: 280 }}
      >
        {/* Text container */}
        <div className="flex-1 p-8 flex flex-col justify-center bg-gradient-to-r from-gray-100 to-gray-50">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Welcome to Your Assessments
          </h1>
          <p className="text-gray-700 text-lg">
            Assess your knowledge and skills through interactive quizzes tailored to your courses.
            Track your progress, identify areas for improvement, and boost your learning journey.
          </p>
          <p className="mt-4 text-gray-600 italic">
            Select a course below to start a random quiz and challenge yourself!
          </p>
        </div>

        {/* Image container */}
        <div
          className="flex-1 min-h-[280px]"
          style={{
            backgroundImage:
              'url("https://images.pexels.com/photos/6958523/pexels-photo-6958523.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
      </section>

      {/* Available Quizzes Section */}
      <h2 className="text-2xl font-semibold mb-6 text-gray-900">Available Quizzes</h2>
      {availableCourses.length === 0 && (
        <p className="text-gray-600 mb-6">You have not selected any courses yet.</p>
      )}
      <ul className="space-y-4 mb-12">
        {availableCourses.map(courseId => (
          <li
            key={courseId}
            className="flex justify-between items-center bg-white p-4 rounded shadow"
          >
            {/* Format courseId to readable text */}
            <span className="capitalize font-medium text-gray-900">
              {courseId.replace(/([A-Z])/g, ' $1')}
            </span>
            <button
              onClick={() => {
                const mappedCourseId = courseIdMap[courseId] || courseId;
                console.log(`Starting quiz for courseId: ${courseId} mapped to: ${mappedCourseId}`);
                setSelectedCourse(mappedCourseId);
              }}
              className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900 transition"
            >
              Start Quiz
            </button>
          </li>
        ))}
      </ul>
      
      {/* See Results Button */}
      <div className="mt-8 text-center">
        <button
          onClick={() => navigate('/dashboard/quiz-results')}
          className="bg-gray-800 text-white px-6 py-3 rounded shadow hover:bg-gray-900 transition"
        >
          See Results
        </button>
      </div>
    </div>
  );
};

export default AssessmentsContent;
