import React, { useState, useEffect, useRef } from 'react';
import {
  ChartBarIcon,
  BookOpenIcon,
  ClipboardListIcon,
  UserCircleIcon,
} from '@heroicons/react/outline';
import { AcademicCapIcon } from '@heroicons/react/outline'; // Added for Study Plan icon
import { ref, onValue } from "firebase/database";
import { db } from '../firebase';
import SelectCourses from './SelectCourses';
import AssessmentsContent from './AssessmentsContent';
import { getAuth, updateProfile } from 'firebase/auth';
import QuizResults from './QuizResults';
import StudyPlan from './StudyPlan'; // Import StudyPlan component
import { useNavigate } from 'react-router-dom';
import AcademicProgressChart from './AcademicProgressChart';
import Modal from './Modal';  // Make sure you have this reusable Modal component
import { Outlet } from 'react-router-dom';

const motivationalTips = [
  "Believe in yourself and all that you are.",
  "Every day is a new opportunity to learn.",
  "Mistakes are proof that you are trying.",
  "Stay positive, work hard, make it happen.",
  "Success is the sum of small efforts repeated daily.",
  "Your potential is endless - keep pushing forward.",
  "Learning never exhausts the mind.",
];

// Helper function to convert numeric score to letter grade
const getLetterGrade = (score) => {
  if (score === null || score === undefined) return 'N/A';
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
};

const NavItem = ({ icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium
      ${active ? 'bg-gray-300 text-gray-900' : 'text-white hover:bg-gray-400 hover:text-gray-900'}
    `}
  >
    <Icon className="h-5 w-5" />
    <span>{label}</span>
  </button>
);

const DashboardContent = ({ userCourses, averageGrade, user }) => {
  const totalCourses = Object.keys(userCourses || {}).length;

  const statCards = [
    {
      label: 'Total Courses',
      value: totalCourses,
      icon: BookOpenIcon,
      color: 'bg-blue-200 text-blue-800',
    },
    {
      label: 'Average Grade',
      value: averageGrade,
      icon: ChartBarIcon,
      color: 'bg-green-200 text-green-800',
    },
    {
      label: 'Attendance',
      value: '95%',
      icon: ClipboardListIcon,
      color: 'bg-yellow-200 text-yellow-800',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((card, idx) => (
          <div
            key={idx}
            className={`flex items-center p-6 rounded-xl shadow ${card.color}`}
          >
            <card.icon className="h-10 w-10 mr-4" />
            <div>
              <div className="text-2xl font-bold">{card.value}</div>
              <div className="text-sm">{card.label}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 bg-white rounded-xl shadow p-6">
        <div className="font-semibold mb-2">Academic Progress</div>
        <AcademicProgressChart user={user} />
      </div>
    </div>
  );
};

const CoursesContent = ({ userCourses, user }) => {
  const [isSelecting, setIsSelecting] = useState(false);

  if (isSelecting) {
    return (
      <SelectCourses
        userId={user.uid}
        onComplete={() => setIsSelecting(false)}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <section className="flex flex-col md:flex-row items-center bg-gradient-to-r from-blue-100 to-white rounded-xl p-8 mb-10 shadow-lg">
        <div className="flex-1 mb-6 md:mb-0 md:pr-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Welcome to Your Courses
          </h1>
          <p className="text-gray-700 text-lg">
            Here you can view your current courses, track your progress, and select new courses to shape your academic journey. Stay organized and motivated!
          </p>
          <button
            onClick={() => setIsSelecting(true)}
            className="mt-6 bg-blue-600 text-white px-6 py-3 rounded shadow hover:bg-blue-700 transition"
          >
            Select Courses
          </button>
        </div>
        <div className="flex-1 flex justify-center">
          <img
            src="https://cdn.pixabay.com/photo/2017/01/31/13/14/school-2027520_1280.png"
            alt="Courses Illustration"
            className="w-72 h-72 object-contain"
          />
        </div>
      </section>

      {Object.keys(userCourses || {}).length > 0 ? (
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
      ) : (
        <div className="text-center text-gray-500 bg-white p-6 rounded-xl shadow">
          <p>You haven't selected any courses yet.</p>
        </div>
      )}
    </div>
  );
};

const DashboardLayout = ({ onLogout, user }) => {
  const [activeMenu, setActiveMenu] = useState('Dashboard');
  const [userCourses, setUserCourses] = useState({});
  const [availableCourses, setAvailableCourses] = useState({});
  const [quizResults, setQuizResults] = useState({});
  const [averageGrade, setAverageGrade] = useState('N/A');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileName, setProfileName] = useState(user?.displayName || '');
  const [profilePhotoURL, setProfilePhotoURL] = useState(user?.photoURL || '');
  const [profilePhotoFile, setProfilePhotoFile] = useState(null);
  const [showFooter, setShowFooter] = useState(false);
  const [motivationalTip, setMotivationalTip] = useState('');
  const [showGetStarted, setShowGetStarted] = useState(false);

  const displayName = user?.displayName || 'User';
  const navigate = useNavigate();
  const mainContentRef = useRef(null);

  // Fetch user courses and available courses
  useEffect(() => {
    if (user?.uid) {
      const userCoursesRef = ref(db, `users/${user.uid}/courses`);
      const unsubscribeCourses = onValue(userCoursesRef, (snapshot) => {
        const data = snapshot.val() || {};
        setUserCourses(data);
      });

      const availableCoursesRef = ref(db, 'availableCourses');
      const unsubscribeAvailable = onValue(availableCoursesRef, (snapshot) => {
        const data = snapshot.val() || {};
        setAvailableCourses(data);
      });

      return () => {
        unsubscribeCourses();
        unsubscribeAvailable();
      };
    }
  }, [user]);

  // Fetch quiz results
  useEffect(() => {
    if (!user?.uid) return;

    const resultsRef = ref(db, `userResults/${user.uid}`);
    const unsubscribeResults = onValue(resultsRef, (snapshot) => {
      const data = snapshot.val() || {};
      setQuizResults(data);
    });

    return () => unsubscribeResults();
  }, [user]);

  // Calculate average grade whenever quizResults change
  useEffect(() => {
    let totalScore = 0;
    let count = 0;

    for (const courseResults of Object.values(quizResults)) {
      for (const attempt of Object.values(courseResults)) {
        if (attempt?.score != null) {
          totalScore += attempt.score;
          count++;
        }
      }
    }

    if (count > 0) {
      const avgScore = totalScore / count;
      setAverageGrade(getLetterGrade(avgScore));
    } else {
      setAverageGrade('N/A');
    }
  }, [quizResults]);

  useEffect(() => {
    const lastTipIndex = parseInt(localStorage.getItem('lastTipIndex'), 10);
    let nextIndex = 0;

    if (!isNaN(lastTipIndex)) {
      nextIndex = (lastTipIndex + 1) % motivationalTips.length;
    }

    setMotivationalTip(motivationalTips[nextIndex]);
    localStorage.setItem('lastTipIndex', nextIndex);
  }, []);

  useEffect(() => {
    if (!user) return;

    const creationTime = new Date(user.metadata.creationTime).getTime();
    const lastSignInTime = new Date(user.metadata.lastSignInTime).getTime();

    if (Math.abs(lastSignInTime - creationTime) < 5 * 60 * 1000) {
      setShowGetStarted(true);
    }
  }, [user]);

  const handleGetStartedClick = () => {
    setShowGetStarted(false);
    setActiveMenu('Courses');
    navigate('/dashboard/courses');
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhotoFile(file);
      setProfilePhotoURL(URL.createObjectURL(file));
    }
  };

  const saveProfileChanges = async () => {
    const auth = getAuth();
    if (!auth.currentUser) return;

    try {
      // TODO: Upload profilePhotoFile to Firebase Storage and get URL, then update photoURL here
      await updateProfile(auth.currentUser, {
        displayName: profileName,
        photoURL: profilePhotoURL,
      });
      alert('Profile updated successfully!');
      setIsEditingProfile(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile.');
    }
  };

  const handleScroll = () => {
    if (!mainContentRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = mainContentRef.current;
    const isBottom = scrollTop + clientHeight >= scrollHeight - 10;

    setShowFooter(isBottom);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-200 relative">
      {/* Top Navigation Bar */}
      <header className="bg-gradient-to-r from-gray-600 via-gray-700 to-gray-800 text-gray-300 flex items-center px-6 py-3 shadow-lg">
        <div className="flex items-center space-x-4">
          <div className="rounded-full bg-gray-200 w-12 h-12 flex items-center justify-center overflow-hidden">
            {profilePhotoURL ? (
              <img
                src={profilePhotoURL}
                alt="Profile"
                className="rounded-full w-12 h-12 object-cover"
              />
            ) : (
              <UserCircleIcon className="h-12 w-12 text-gray-400" />
            )}
          </div>
          <div className="text-white font-semibold">{displayName}</div>
          <button
            onClick={() => setIsEditingProfile(true)}
            className="ml-4 bg-gray-800 px-3 py-1 rounded hover:bg-gray-900 transition text-sm"
          >
            Edit Profile
          </button>
        </div>

        <nav className="ml-auto flex space-x-4">
          <NavItem
            icon={ChartBarIcon}
            label="Dashboard"
            active={activeMenu === 'Dashboard'}
            onClick={() => {
              setActiveMenu('Dashboard');
              navigate('/dashboard');
            }}
          />
          <NavItem
            icon={BookOpenIcon}
            label="Courses"
            active={activeMenu === 'Courses'}
            onClick={() => {
              setActiveMenu('Courses');
              navigate('/dashboard/courses');
            }}
          />
          <NavItem
            icon={ClipboardListIcon}
            label="Assessments"
            active={activeMenu === 'Assessments'}
            onClick={() => {
              setActiveMenu('Assessments');
              navigate('/dashboard/assessments');
            }}
          />
          <NavItem
            icon={ClipboardListIcon}
            label="Quiz Results"
            active={activeMenu === 'QuizResults'}
            onClick={() => {
              setActiveMenu('QuizResults');
              navigate('/dashboard/quiz-results');
            }}
          />
          <NavItem
            icon={BookOpenIcon} // or choose an appropriate icon
            label="Study Plan"
            active={activeMenu === 'StudyPlan'}
            onClick={() => {
              setActiveMenu('StudyPlan');
              navigate('/dashboard/study-plan');
          }}  
          />
        </nav>

        <button
          onClick={onLogout}
          className="ml-6 bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900 transition"
        >
          Logout
        </button>
      </header>

      {/* Main Content */}
      <main
        className="flex-1 overflow-auto p-12"
        onScroll={handleScroll}
        ref={mainContentRef}
      >
        {activeMenu === 'Dashboard' && (
          <>
            <section className="w-full bg-gradient-to-r from-gray-300 to-gray-100 rounded-xl mb-12 flex flex-col md:flex-row shadow-lg overflow-hidden" style={{ minHeight: 280 }}>
              <div className="flex-1 p-12 flex flex-col justify-center">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                  Student Academic Progress Tracker
                </h1>
                <p className="text-lg text-gray-600 mb-6 max-w-lg">
                  Monitor your academic journey, set goals, and unlock your full potential. Track your progress, analyze your performance, and stay motivated every step of the way.
                </p>

                {showGetStarted && (
                  <button
                    onClick={handleGetStartedClick}
                    className="mt-6 bg-gray-800 text-white px-3 py-2 rounded shadow hover:bg-gray-900 transition text-sm w-28"
                  >
                    Get Started
                  </button>
                )}
              </div>

              <div className="flex-1 relative min-h-[280px]">
                <img
                  src="https://images.pexels.com/photos/289737/pexels-photo-289737.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="Academic Illustration"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            </section>

            <h1 className="text-2xl font-semibold text-gray-800 mb-8">
              Welcome, {displayName.split(' ')[0]}!
            </h1>
            <DashboardContent userCourses={userCourses} averageGrade={averageGrade} user={user} />

            <div className="mt-12 p-6 bg-gradient-to-r from-green-100 to-green-200 rounded-xl shadow text-center text-green-900 font-semibold text-lg max-w-4xl mx-auto">
              💡 Motivational Tip: {motivationalTip}
            </div>
          </>
        )}

        {activeMenu === 'Courses' && (
          <CoursesContent userCourses={userCourses} user={user} />
        )}

        {activeMenu === 'Assessments' && (
          <AssessmentsContent userCourses={userCourses} user={user} />
        )}

        {activeMenu === 'QuizResults' && (
          <QuizResults user={user} />
        )}

        {/* Added Study Plan rendering */}
        {activeMenu === 'StudyPlan' && (
          <StudyPlan user={user} />
        )}
      </main>

      {showFooter && (
        <footer className="bg-gradient-to-r from-gray-600 via-gray-700 to-gray-800 text-gray-300 text-center py-4 transition-opacity duration-500">
          <p>
            &copy; {new Date().getFullYear()} Your Company. All rights reserved.
          </p>
        </footer>
      )}

      {/* Profile Edit Modal */}
      <Modal isOpen={isEditingProfile} onClose={() => setIsEditingProfile(false)}>
        <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
        <div className="space-y-4">
          <input
            type="text"
            value={profileName}
            onChange={(e) => setProfileName(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="Name"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="w-full"
          />
          {profilePhotoURL && (
            <img
              src={profilePhotoURL}
              alt="Preview"
              className="w-20 h-20 rounded-full object-cover"
            />
          )}
          <div className="flex justify-end space-x-3 mt-4">
            <button
              onClick={() => setIsEditingProfile(false)}
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 transition"
            >
              Cancel
            </button>
            <button
              onClick={saveProfileChanges}
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Save
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DashboardLayout;
