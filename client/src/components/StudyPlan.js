import React, { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebase';

const studyResources = {
  'Software Engineering': [
    {
      title: 'Software Engineering Principles - Article',
      type: 'Article',
      url: 'https://example.com/software-engineering-principles',
    },
  ],
  'Data Structures': [
    {
      title: 'Data Structures Basics - Video',
      type: 'Video',
      url: 'https://www.khanacademy.org/computing/computer-science/algorithms',
    },
    {
      title: 'Data Structures Study Guide PDF',
      type: 'Guide',
      url: '/resources/data-structures-guide.pdf',
    },
  ],
  // Add more topics/resources as needed
};

const generalStudyMaterials = [
  {
    title: 'Effective Study Techniques',
    description: 'Learn proven methods to improve your study habits and retention.',
    url: 'https://learningcenter.unc.edu/tips-and-tools/studying-101-study-smarter-not-harder/',
    type: 'Article',
  },
  {
    title: 'Time Management for Students',
    description: 'Master your schedule with these time management strategies.',
    url: 'https://summer.harvard.edu/blog/8-time-management-tips-for-students/',
    type: 'Article',
  },
  {
    title: 'Note-Taking Strategies',
    description: 'Explore various note-taking methods to find what works best for you.',
    url: 'https://www.notion.com/help/guides',
    type: 'Guide',
  },
  {
    title: 'Mind Mapping Tutorial',
    description: 'Visualize your ideas and organize information effectively.',
    url: 'https://youtu.be/g7j_CoKD1Xs',
    type: 'Video',
  },
];

const topicMap = {
  softwareEngineering: 'Software Engineering',
  dataStructures: 'Data Structures',
  // Add more mappings as needed
};

const SCORE_THRESHOLD = 70;

const StudyPlan = ({ user }) => {
  const [quizResults, setQuizResults] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;

    const resultsRef = ref(db, `userResults/${user.uid}`);
    const unsubscribe = onValue(resultsRef, (snapshot) => {
      setQuizResults(snapshot.val() || {});
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const getAverageScores = () => {
    const topicScores = {};
    for (const [courseId, attempts] of Object.entries(quizResults)) {
      let totalScore = 0;
      let count = 0;
      for (const attempt of Object.values(attempts)) {
        if (typeof attempt.score === 'number') {
          totalScore += attempt.score;
          count++;
        }
      }
      if (count > 0) {
        topicScores[courseId] = totalScore / count;
      }
    }
    return topicScores;
  };

  const averages = getAverageScores();

  const lowScoreTopics = () => {
    return Object.entries(averages)
      .filter(([, avgScore]) => avgScore < SCORE_THRESHOLD)
      .map(([topic]) => topicMap[topic] || topic);
  };

  const lowTopics = lowScoreTopics();

  const personalizedRecommendations = lowTopics.flatMap(topic => studyResources[topic] || []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-100 to-gray-50 p-12 flex flex-col items-center">
      {/* Hero Section */}
      <section className="max-w-5xl w-full flex flex-col md:flex-row items-center bg-white rounded-xl shadow-lg overflow-hidden mb-12">
        <div className="flex-1 p-12">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-6">
            Your Personalized Study Plan
          </h1>
          <p className="text-lg text-gray-700 mb-6">
            Unlock your full potential with tailored study recommendations based on your quiz performance. Stay motivated, focused, and organized to achieve academic success.
          </p>
          <p className="text-gray-600">
            Below you’ll find personalized resources to help you improve, along with general study materials to build strong learning habits.
          </p>
        </div>
        <div className="flex-1 p-8">
          <img
            src="https://images.pexels.com/photos/4458554/pexels-photo-4458554.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            alt="Student studying"
            className="rounded-xl shadow-lg object-cover w-full h-64 md:h-80"
          />
        </div>
      </section>

      {/* Personalized Recommendations */}
      <section className="max-w-5xl w-full bg-gray-50 rounded-xl shadow-lg p-10 mb-12">
        <h2 className="text-3xl font-semibold text-gray-900 mb-8 text-center">
          Personalized Recommendations
        </h2>
        {loading ? (
          <p className="text-center text-gray-500">Loading your personalized recommendations...</p>
        ) : personalizedRecommendations.length === 0 ? (
          <p className="text-center text-green-700 font-semibold">
            Great job! No personalized study recommendations at this time.
          </p>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {personalizedRecommendations.map((res, idx) => (
              <li key={idx} className="border border-gray-300 rounded-lg p-6 hover:shadow-lg transition-shadow bg-white">
                <a
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-900 font-semibold text-lg hover:underline"
                >
                  {res.title}
                </a>
                <p className="mt-2 text-gray-600">{res.type}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* General Study Materials */}
      <section className="max-w-5xl w-full bg-gray-50 rounded-xl shadow-lg p-10">
        <h2 className="text-3xl font-semibold text-gray-900 mb-8 text-center">
          General Study Materials
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {generalStudyMaterials.map(({ title, description, url, type }, idx) => (
            <a
              key={idx}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col p-6 border border-gray-300 rounded-lg hover:shadow-lg transition-shadow bg-white"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
              <p className="text-gray-700 flex-grow">{description}</p>
              <span className="mt-4 inline-block text-sm font-medium text-gray-600 underline">
                {type}
              </span>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
};

export default StudyPlan;
