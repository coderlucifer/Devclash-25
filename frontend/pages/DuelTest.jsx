import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function DuelTest() {
  const navigate = useNavigate()
  const [student, setStudent] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(()=>{
    if(!localStorage.getItem("student")){
      alert("signup first")
      navigate("/signup")
      return
    }
  },[])

  // Mock data
  const subjects = ['Mathematics', 'Science', 'English', 'Social Studies', 'Computer Science'];
  const mockOnlineUsers = [
    { id: 1, name: 'John Smith', rating: 1250, avatar: 'J' },
    { id: 2, name: 'Sarah Johnson', rating: 1450, avatar: 'S' },
    { id: 3, name: 'Michael Brown', rating: 1320, avatar: 'M' },
    { id: 4, name: 'Emma Wilson', rating: 1380, avatar: 'E' },
    { id: 5, name: 'David Lee', rating: 1290, avatar: 'D' },
  ];

  useEffect(() => {
    const storedStudent = localStorage.getItem('student');
    if (storedStudent) {
      setStudent(JSON.parse(storedStudent));
    } else {
      alert("Problem during signin");
    }
    
    // Set mock online users
    setOnlineUsers(mockOnlineUsers);
  }, []);

  const filteredUsers = onlineUsers.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRandomMatch = () => {
    if (!selectedSubject) {
      alert("Please select a subject first");
      return;
    }
    alert(`Finding a random opponent for ${selectedSubject} at ${difficulty} difficulty...`);
    // In a real app, this would initiate matchmaking
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-blue-600 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/dashboard" className="text-xl font-bold">STEM SPARK</Link>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-1 rounded-full hover:bg-blue-500 transition">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
              {student && (
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{student.firstName}</span>
                  <div className="h-8 w-8 rounded-full bg-blue-400 flex items-center justify-center">
                    {student.firstName[0].toUpperCase()}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Back button */}
        <div className="mb-6">
          <Link to="/dashboard" className="text-blue-600 hover:text-blue-800 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </Link>
        </div>

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Duel Test</h1>
          <p className="text-gray-600">Challenge other students and test your knowledge</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Duel Settings */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Duel Settings</h2>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <select 
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                >
                  <option value="">Select a subject</option>
                  {subjects.map((subject, index) => (
                    <option key={index} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                <div className="flex space-x-2">
                  <button 
                    className={`flex-1 py-2 rounded-md text-center transition ${difficulty === 'easy' ? 'bg-green-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                    onClick={() => setDifficulty('easy')}
                  >
                    Easy
                  </button>
                  <button 
                    className={`flex-1 py-2 rounded-md text-center transition ${difficulty === 'medium' ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                    onClick={() => setDifficulty('medium')}
                  >
                    Medium
                  </button>
                  <button 
                    className={`flex-1 py-2 rounded-md text-center transition ${difficulty === 'hard' ? 'bg-red-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                    onClick={() => setDifficulty('hard')}
                  >
                    Hard
                  </button>
                </div>
              </div>
              
              <button 
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-md transition flex items-center justify-center"
                onClick={handleRandomMatch}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
                Find Random Opponent
              </button>
            </div>

            {/* Your Stats */}
            <div className="bg-white rounded-lg shadow p-6 mt-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Your Duel Stats</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Rating</p>
                  <p className="text-xl font-bold text-gray-800">{student?.testRating || 1200}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Rank</p>
                  <p className="text-xl font-bold text-gray-800">#{student?.rank || 342}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Wins</p>
                  <p className="text-xl font-bold text-green-600">{student?.wins || 18}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Losses</p>
                  <p className="text-xl font-bold text-red-600">{student?.losses || 7}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Available Opponents */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">Available Opponents</h2>
                <div className="mt-4 relative">
                  <input
                    type="text"
                    placeholder="Search opponents..."
                    className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              
              <div className="divide-y divide-gray-200">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map(user => (
                    <div key={user.id} className="p-4 hover:bg-gray-50 transition">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-blue-400 flex items-center justify-center text-white font-semibold">
                            {user.avatar}
                          </div>
                          <div className="ml-4">
                            <h4 className="font-medium text-gray-800">{user.name}</h4>
                            <p className="text-sm text-gray-500">Rating: {user.rating}</p>
                          </div>
                        </div>
                        <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition">
                          Challenge
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-gray-500">
                    No users match your search
                  </div>
                )}
              </div>
            </div>

            {/* Duel History */}
            <div className="bg-white rounded-lg shadow overflow-hidden mt-6">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">Recent Duels</h2>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-lg">
                  <div className="text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No recent duels</h3>
                    <p className="mt-1 text-sm text-gray-500">Your duel history will appear here</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DuelTest;