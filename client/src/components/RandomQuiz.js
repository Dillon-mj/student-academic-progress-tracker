import React, { useState, useEffect } from 'react';
import { ref, get, set } from 'firebase/database';
import { db } from '../firebase';

const RandomQuiz = ({ userId, courseId, numQuestions = 10, timeLimit = 600, onComplete }) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [finished, setFinished] = useState(false);
  const [score, setScore] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!courseId) {
          setError('Invalid course selected.');
          setLoading(false);
          return;
        }

        const questionsRef = ref(db, `questions/${courseId}`);
        const snapshot = await get(questionsRef);
        const allQuestions = snapshot.val();

        if (!allQuestions || Object.keys(allQuestions).length === 0) {
          setError('No questions available for this course.');
          setLoading(false);
          return;
        }

        // Convert questions object to array and shuffle
        const questionArray = Object.entries(allQuestions).map(([id, q]) => ({ id, ...q }));
        const shuffled = questionArray.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, numQuestions);

        setQuestions(selected);
        setTimeLeft(timeLimit);
        setAnswers({});
        setCurrentIndex(0);
        setFinished(false);
        setScore(null);
      } catch (err) {
        console.error('Error fetching questions:', err);
        setError('Failed to load questions.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [courseId, numQuestions, timeLimit]);

  // Timer countdown effect
  useEffect(() => {
    if (finished || loading) return;

    if (timeLeft <= 0) {
      finishQuiz();
      return;
    }

    const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timerId);
  }, [timeLeft, finished, loading]);

  const handleAnswer = (questionId, optionIndex) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const finishQuiz = async () => {
    setFinished(true);

    let correctCount = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correctAnswer) correctCount++;
    });

    const calculatedScore = Math.round((correctCount / questions.length) * 100);
    setScore(calculatedScore);

    try {
      await set(ref(db, `userResults/${userId}/${courseId}/${Date.now()}`), {
        score: calculatedScore,
        completedAt: new Date().toISOString(),
        totalQuestions: questions.length,
      });
    } catch (err) {
      console.error('Failed to save quiz result:', err);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading questions...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-600">{error}</div>;
  }

  if (finished) {
    return (
      <div className="max-w-xl mx-auto p-6 bg-white rounded shadow text-center">
        <h2 className="text-2xl font-bold mb-4">Quiz Completed!</h2>
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

  const currentQuestion = questions[currentIndex];

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">
          Question {currentIndex + 1} of {questions.length}
        </h2>
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
          onClick={() => setCurrentIndex(i => Math.max(0, i - 1))}
          disabled={currentIndex === 0}
          className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
        >
          Previous
        </button>
        {currentIndex < questions.length - 1 ? (
          <button
            onClick={() => setCurrentIndex(i => Math.min(questions.length - 1, i + 1))}
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

export default RandomQuiz;
