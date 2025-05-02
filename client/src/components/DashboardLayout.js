import React, { useState } from 'react';
import {
  ChartBarIcon,
  BookOpenIcon,
  ClipboardListIcon,
  UserCircleIcon,
} from '@heroicons/react/outline';

// Sidebar item component
const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-3 px-4 py-3 rounded-md w-full text-left
      ${active ? 'bg-gray-300 text-gray-900' : 'text-white hover:bg-gray-400 hover:text-gray-900'}
    `}
  >
    <span className="bg-white rounded p-1">
      <Icon className="h-6 w-6" />
    </span>
    <span className="text-md font-medium">{label}</span>
  </button>
);

const statCards = [
  {
    label: 'Total Courses',
    value: 6,
    icon: BookOpenIcon,
    color: 'bg-blue-200 text-blue-800',
  },
  {
    label: 'Average Grade',
    value: 'A-',
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

const DashboardContent = () => (
  <div className="space-y-8">
    {/* Stat Cards */}
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
    {/* Progress Chart Placeholder */}
    <div className="mt-8 bg-white rounded-xl shadow p-6">
      <div className="font-semibold mb-2">Academic Progress</div>
      <div className="h-40 flex items-center justify-center text-gray-400">
        {/* You can replace this with a real chart */}
        [Progress Chart Placeholder]
      </div>
    </div>
  </div>
);

const CoursesContent = () => (
  <div className="mt-6">
    <div className="font-semibold mb-2">Your Courses</div>
    <ul className="list-disc list-inside text-gray-700">
      <li>Mathematics</li>
      <li>English Literature</li>
      <li>Physics</li>
      <li>Chemistry</li>
      <li>History</li>
      <li>Computer Science</li>
    </ul>
  </div>
);

const AssessmentsContent = () => (
  <div className="mt-6">
    <div className="font-semibold mb-2">Recent Assessments</div>
    <table className="w-full text-left">
      <thead>
        <tr>
          <th className="py-2">Subject</th>
          <th className="py-2">Score</th>
          <th className="py-2">Date</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Mathematics</td>
          <td>92%</td>
          <td>2025-04-15</td>
        </tr>
        <tr>
          <td>English Literature</td>
          <td>88%</td>
          <td>2025-04-10</td>
        </tr>
        <tr>
          <td>Physics</td>
          <td>95%</td>
          <td>2025-03-28</td>
        </tr>
      </tbody>
    </table>
  </div>
);

const DashboardLayout = ({onLogout, user}) => {
  const [activeMenu, setActiveMenu] = useState('Dashboard');

  const displayName = user?.displayName || 'User';

  return (
    <div className="flex h-screen bg-gray-200">
      {/*Logout Button */}
      <button
        onClick={onLogout}
        className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
      >
        Logout
      </button>

      {/* Sidebar */}
      <aside className="w-64 bg-gray-400 flex flex-col items-center py-8 space-y-8">
        {/* Profile Picture */}
        <div className="rounded-full bg-gray-200 w-24 h-24 flex items-center justify-center">
          <UserCircleIcon className="h-20 w-20 text-gray-400" />
        </div>
        {/* User Name */}
        <h2 className="text-white text-lg font-semibold">{displayName}</h2>
        {/* Navigation */}
        <nav className="flex flex-col space-y-3 w-full px-2">
          <SidebarItem
            icon={ChartBarIcon}
            label="Dashboard"
            active={activeMenu === 'Dashboard'}
            onClick={() => setActiveMenu('Dashboard')}
          />
          <SidebarItem
            icon={BookOpenIcon}
            label="Courses"
            active={activeMenu === 'Courses'}
            onClick={() => setActiveMenu('Courses')}
          />
          <SidebarItem
            icon={ClipboardListIcon}
            label="Assessments"
            active={activeMenu === 'Assessments'}
            onClick={() => setActiveMenu('Assessments')}
          />
        </nav>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-12">
        <h1 className="text-2xl font-semibold text-gray-800 mb-8">
          Welcome, {displayName.split(' ')[0]}!
        </h1>
        {activeMenu === 'Dashboard' && <DashboardContent />}
        {activeMenu === 'Courses' && <CoursesContent />}
        {activeMenu === 'Assessments' && <AssessmentsContent />}
      </main>
    </div>
  );
};



export default DashboardLayout;
