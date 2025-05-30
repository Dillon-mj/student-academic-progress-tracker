import React, { useState, useEffect } from 'react';
import { ref, set } from 'firebase/database';
import { db } from '../firebase';

const Quiz = ({ userId, courseId, quizId, quizData, onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(quizData.timeLimit);
  const [finished, setFinished] = useState(false);
  const [score, setScore] = useState(null);

  useEffect(() => {
    if (timeLeft <= 0 && !finished) {
      finishQuiz();
      return;
    }
    if (finished) return;

    const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timerId);
  }, [timeLeft, finished]);

  const handleAnswer = (questionId, optionIndex) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const finishQuiz = async () => {
    setFinished(true);

    // Calculate score
    let correctCount = 0;
    quizData.questions.forEach(q => {
      if (answers[q.id] === q.correctAnswer) correctCount++;
    });
    const calculatedScore = Math.round((correctCount / quizData.questions.length) * 100);
    setScore(calculatedScore);

    // Save result to Firebase
    await set(ref(db, `userResults/${userId}/${courseId}/${quizId}`), {
      score: calculatedScore,
      completedAt: new Date().toISOString(),
    });
  };

  if (finished) {
    return (
      <div className="max-w-xl mx-auto p-6 bg-white rounded shadow text-center">
        <h2 className="text-2xl font-bold mb-4">{quizData.title} - Results</h2>
        <p className="text-lg mb-4">Your Score: <strong>{score}%</strong></p>
        <button
          onClick={onComplete}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Back to Assessments
        </button>
      </div>
    );
  }

  const currentQuestion = quizData.questions[currentQuestionIndex];

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">{quizData.title}</h2>
        <div className="text-red-600 font-bold">
          Time Left: {Math.floor(timeLeft / 60)}:{('0' + (timeLeft % 60)).slice(-2)}
        </div>
      </div>

      <div>
        <p className="mb-4 font-medium">{currentQuestion.question}</p>
        <ul>
          {currentQuestion.options.map((option, idx) => (
            <li key={idx} className="mb-2">
              <label className="cursor-pointer flex items-center space-x-3">
                <input
                  type="radio"
                  name={currentQuestion.id}
                  checked={answers[currentQuestion.id] === idx}
                  onChange={() => handleAnswer(currentQuestion.id, idx)}
                  className="form-radio"
                />
                <span>{option}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={() => setCurrentQuestionIndex(i => Math.max(0, i - 1))}
          disabled={currentQuestionIndex === 0}
          className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
        >
          Previous
        </button>
        {currentQuestionIndex < quizData.questions.length - 1 ? (
          <button
            onClick={() => setCurrentQuestionIndex(i => Math.min(quizData.questions.length - 1, i + 1))}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Next
          </button>
        ) : (
          <button
            onClick={finishQuiz}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Submit Quiz
          </button>
        )}
      </div>
    </div>
  );
};

export default Quiz;
