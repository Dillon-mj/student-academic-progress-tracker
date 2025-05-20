import React, { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebase';

const QuizResults = ({ user }) => {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;

    const resultsRef = ref(db, `userResults/${user.uid}`);
    const unsubscribe = onValue(resultsRef, (snapshot) => {
      setResults(snapshot.val() || {});
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const availableCourses = Object.keys(results);

  return (
    <div className="max-w-6xl mx-auto p-8">
      {/* Landing Section */}
      <section
        className="flex flex-col md:flex-row rounded-xl mb-12 shadow-lg overflow-hidden"
        style={{ minHeight: 280 }}
      >
        {/* Text container */}
        <div className="flex-1 p-8 flex flex-col justify-center bg-gray-50">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Your Quiz Results
          </h1>
          <p className="text-lg text-gray-600">
            Track your quiz performance over time, review your scores, and celebrate your learning achievements. Use these insights to identify strengths and areas for improvement.
          </p>
        </div>

        {/* Image container */}
        <div
          className="flex-1 min-h-[280px]"
          style={{
            backgroundImage:
              'url("https://images.pexels.com/photos/4145190/pexels-photo-4145190.jpeg?auto=compress&cs=tinysrgb&w=600")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundBlendMode: 'multiply',
            backgroundColor: 'rgba(229, 231, 235, 0.6)', // Tailwind gray-200 with opacity
          }}
        />
      </section>

      {/* Results Table */}
      <h2 className="text-3xl font-semibold mb-6 text-gray-800">Recent Quiz Attempts</h2>

      {loading ? (
        <p>Loading your quiz results...</p>
      ) : availableCourses.length === 0 ? (
        <p className="text-gray-600">No quiz results found yet.</p>
      ) : (
        availableCourses.map(courseId => {
          const attempts = results[courseId];
          return (
            <div key={courseId} className="mb-10">
              <h3 className="text-2xl font-bold capitalize mb-4 text-gray-700">
                {courseId.replace(/([A-Z])/g, ' $1')}
              </h3>
              <table className="w-full table-auto border-collapse border border-gray-300 rounded-lg overflow-hidden shadow-sm">
                <thead className="bg-gray-200 text-gray-900">
                  <tr>
                    <th className="border border-gray-300 px-4 py-2 text-left">Date</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Score (%)</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Total Questions</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(attempts)
                    .sort((a, b) => b[0] - a[0]) // Sort descending by timestamp
                    .map(([timestamp, attempt]) => (
                      <tr key={timestamp} className="hover:bg-gray-100">
                        <td className="border border-gray-300 px-4 py-2">
                          {new Date(attempt.completedAt).toLocaleString()}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 font-semibold">
                          {attempt.score}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">{attempt.totalQuestions}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          );
        })
      )}
    </div>
  );
};

export default QuizResults;
