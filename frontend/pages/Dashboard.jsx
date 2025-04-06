import React, { useState ,useEffect} from 'react';
import { Link } from 'react-router-dom';
import {useNavigate} from "react-router-dom";

// Mock data for testing
const mockProgressData = [
  { subject: 'Mathematics', completedTopics: 12, totalTopics: 20, score: 85 },
  { subject: 'Science', completedTopics: 8, totalTopics: 15, score: 92 },
  { subject: 'English', completedTopics: 15, totalTopics: 18, score: 78 },
  { subject: 'Social Studies', completedTopics: 5, totalTopics: 12, score: 88 },
];

const recentTestData = [
  { id: 1, name: 'Mathematics Quiz', date: '2 Apr', score: 85, totalQuestions: 20 },
  { id: 2, name: 'Science Test', date: '28 Mar', score: 92, totalQuestions: 25 },
  { id: 3, name: 'English Vocabulary', date: '25 Mar', score: 78, totalQuestions: 30 },
];

function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  //const studentName = "Alex Johnson"; // Would come from authentication context in real app
  const [student, setStudent] = useState(null);
  const navigate=useNavigate()

  useEffect(()=>{
    if(!localStorage.getItem("student")){
      alert("signup first")
      navigate("/signup")
      return
    }
  },[])

  function handleLogout(){
    localStorage.removeItem("token")
    localStorage.removeItem("student")
    navigate("/signup")

  }
  

  useEffect(() => {
    const storedStudent = localStorage.getItem('student');
    if (storedStudent) {
      setStudent(JSON.parse(storedStudent));
    }else{
      alert("Problem during signin");
    }
  }, []);

  console.log("after useEffect",student)

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-blue-600 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold">STEM SPARK</span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-1 rounded-full hover:bg-blue-500 transition">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
              <div className="flex items-center space-x-2">
                <span className="font-medium">{student?.firstName}</span>
                
                <div className="h-8 w-8 rounded-full bg-blue-400 flex items-center justify-center">
                  {student?.firstName[0].toUpperCase()}
                </div>
                <button onClick={handleLogout} className=' p-2 space-x-2 border: rounded-2xl hover:bg-blue-800'>Logout</button>
                
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Welcome back, {student?.firstName.split(' ')[0]}!</h1>
          <p className="text-gray-600">Continue your learning journey</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500 hover:shadow-md transition">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm">Your Rating</p>
                <h3 className="text-2xl font-bold text-gray-800">{student?.testRating}</h3>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500 hover:shadow-md transition">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm">Tests Completed</p>
                <h3 className="text-2xl font-bold text-gray-800">{student?.testCompleted}</h3>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500 hover:shadow-md transition">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm">Hours Studied</p>
                <h3 className="text-2xl font-bold text-gray-800">18.5</h3>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Main Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition flex flex-col items-center justify-center py-8 cursor-pointer group">
            <div className="p-4 bg-blue-100 rounded-full mb-4 group-hover:bg-blue-200 transition">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Duel Test</h3>
            <p className="text-gray-600 text-center">Challenge other students to test your knowledge</p>
            <button onClick={()=>navigate("/duel")} className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition">Start Duel</button>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition flex flex-col items-center justify-center py-8 cursor-pointer group">
            <div className="p-4 bg-green-100 rounded-full mb-4 group-hover:bg-green-200 transition">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Group Test</h3>
            <p className="text-gray-600 text-center">Join group tests with classmates</p>
            <button className="mt-4 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded transition">Join Group</button>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition flex flex-col items-center justify-center py-8 cursor-pointer group">
            <div className="p-4 bg-blue-100 rounded-full mb-4 group-hover:bg-blue-200 transition">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Practice Test</h3>
            <p className="text-gray-600 text-center">Take a practice test to prepare</p>
            <button onClick={()=>navigate("/start-test")} className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition">Start Practice</button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b">
          <div className="flex space-x-8">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 font-medium transition ${activeTab === 'overview' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Overview
            </button>
            <button 
              onClick={() => setActiveTab('progress')}
              className={`py-4 px-1 font-medium transition ${activeTab === 'progress' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Progress
            </button>
            <button 
              onClick={() => setActiveTab('achievements')}
              className={`py-4 px-1 font-medium transition ${activeTab === 'achievements' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Achievements
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Tests */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">Recent Tests</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {recentTestData.map(test => (
                  <div key={test.id} className="p-4 hover:bg-gray-50 transition">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium text-gray-800">{test.name}</h4>
                        <p className="text-sm text-gray-500">{test.date}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold text-gray-800">{test.score}%</span>
                        <p className="text-xs text-gray-500">{Math.round(test.score / 100 * test.totalQuestions)}/{test.totalQuestions} questions</p>
                      </div>
                    </div>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${test.score >= 90 ? 'bg-green-500' : test.score >= 70 ? 'bg-blue-500' : 'bg-yellow-500'}`}
                        style={{ width: `${test.score}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <Link to="/tests" className="text-blue-600 hover:text-blue-800 font-medium text-sm transition">
                  View All Tests
                </Link>
              </div>
            </div>

            {/* Upcoming Tests */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">Upcoming Tests</h3>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-center h-48 border-2 border-dashed border-gray-300 rounded-lg">
                  <div className="text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No upcoming tests</h3>
                    <p className="mt-1 text-sm text-gray-500">Schedule a new test or join a group test</p>
                    <div className="mt-6">
                      <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition">
                        Schedule Test
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'progress' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Subject Progress</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {mockProgressData.map((subject, index) => (
                <div key={index} className="p-6 hover:bg-gray-50 transition">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium text-gray-800">{subject.subject}</h4>
                    <span className="text-sm font-semibold text-gray-600">
                      {subject.completedTopics}/{subject.totalTopics} topics
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${(subject.completedTopics / subject.totalTopics) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-gray-500">Average Score: {subject.score}%</span>
                    <Link to={`/subjects/${subject.subject.toLowerCase()}`} className="text-sm text-blue-600 hover:text-blue-800 transition">
                      Continue Learning
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center py-12">
              <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Achievements Coming Soon</h3>
              <p className="mt-2 text-sm text-gray-500">
                Complete more lessons and tests to unlock achievements
              </p>
              <div className="mt-6">
                <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition">
                  Explore Courses
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;