// AcademicProgressChart.js
import React, { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebase';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const AcademicProgressChart = ({ user }) => {
  const [quizData, setQuizData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;

    const resultsRef = ref(db, `userResults/${user.uid}`);
    const unsubscribe = onValue(resultsRef, (snapshot) => {
      const results = snapshot.val() || {};
      // Transform the data into chart format
      const chartData = Object.entries(results).flatMap(([courseId, attempts]) => {
        return Object.entries(attempts).map(([timestamp, result]) => ({
          quizNumber: new Date(result.completedAt).getTime(), // Using timestamp as quiz number
          score: result.score,
          course: courseId,
        }));
      });
      setQuizData(chartData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  if (loading) {
    return <p>Loading quiz data...</p>;
  }

  return (
    <LineChart
      width={800}
      height={400}
      data={quizData}
      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="quizNumber"  />
      <YAxis domain={[0, 100]}/>
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="score" stroke="#8884d8" name="Score" />
    </LineChart>
  );
};

export default AcademicProgressChart;
