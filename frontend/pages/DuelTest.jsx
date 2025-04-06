import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';

function DuelTest() {
  const navigate = useNavigate();
  const { socket, connected } = useSocket();
  const [studentData, setStudentData] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Check if student is logged in
  // In your useEffect for socket events
useEffect(() => {
  if (!socket || !connected) return;
  
  const handleActiveUsers = (users) => {
    if (!users || !Array.isArray(users)) {
      console.warn('Received invalid users data:', users);
      return;
    }
    
    // Filter out the current user if studentData exists
    const filteredUsers = studentData 
      ? users.filter(user => user.userId !== studentData._id)
      : [];
      
    setOnlineUsers(filteredUsers);
  };
  
  socket.on("active-users", handleActiveUsers);
  
  return () => {
    socket.off("active-users", handleActiveUsers);
  };
}, [socket, connected, studentData]);
  useEffect(() => {
    const storedStudent = localStorage.getItem("student");
    if (!storedStudent) {
      alert("Signup first");
      navigate("/signup");
      return;
    }
    
    const parsedData = JSON.parse(storedStudent);
    setStudentData(parsedData);
    
    // Emit login when student data is available and socket is ready
    if (connected && parsedData._id) {
      socket.emit("login", {
        userId: parsedData._id,
        username: parsedData.firstName,
        rating: parsedData.testRating || 1200
      });
    }
  }, [navigate, connected, socket]);

  // Listen for active users updates from server
  useEffect(() => {
    if (!socket) return;
    
    const handleActiveUsers = (users) => {
      // Filter out the current user
      const filteredUsers = users.filter(user => 
        user.userId !== studentData?._id
      );
      setOnlineUsers(filteredUsers);
    };
    
    socket.on("active-users", handleActiveUsers);
    
    return () => {
      socket.off("active-users", handleActiveUsers);
    };
  }, [socket, studentData]);

  // Filter users by search query
  const filteredUsers = onlineUsers.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // For random matching
  const handleRandomMatch = () => {
    if (!selectedSubject) {
      alert("Please select a subject first");
      return;
    }
    
    const newRoomId = `${selectedSubject}-${difficulty}-${Date.now().toString(36)}`;
    navigateToDuel(newRoomId);
  };

  // For challenging a specific user
  const handleChallenge = (opponentId) => {
    if (!selectedSubject) {
      alert("Please select a subject first");
      return;
    }
    
    // Create a consistent room ID using both user IDs
    const userIds = [studentData._id, opponentId].sort();
    const newRoomId = `${userIds.join("-")}-${selectedSubject}-${difficulty}`;
    navigateToDuel(newRoomId);
  };
  
  // Common function to start a duel
  const navigateToDuel = (roomId) => {
    navigate("/duel", { 
      state: { 
        userId: studentData._id,
        roomId: roomId,
        subject: selectedSubject,
        difficulty: difficulty
      } 
    });
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
              {studentData && (
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{studentData.firstName}</span>
                  <div className="h-8 w-8 rounded-full bg-blue-400 flex items-center justify-center">
                    {studentData.firstName[0].toUpperCase()}
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
                  {['Mathematics', 'Science', 'English', 'Social Studies', 'Computer Science'].map((subject, index) => (
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
            
            {/* User Stats */}
            <div className="bg-white rounded-lg shadow p-6 mt-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Your Duel Stats</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Rating</p>
                  <p className="text-xl font-bold text-gray-800">{studentData?.testRating || 1200}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Rank</p>
                  <p className="text-xl font-bold text-gray-800">#{studentData?.rank || "-"}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Wins</p>
                  <p className="text-xl font-bold text-green-600">{studentData?.wins || 0}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Losses</p>
                  <p className="text-xl font-bold text-red-600">{studentData?.losses || 0}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Opponents List */}
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
                    <div key={user.userId} className="p-4 hover:bg-gray-50 transition">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-blue-400 flex items-center justify-center text-white font-semibold">
                            {user.username?.charAt(0).toUpperCase() || '?'}
                          </div>
                          <div className="ml-4">
                            <h4 className="font-medium text-gray-800">{user.username}</h4>
                            <p className="text-sm text-gray-500">Rating: {user.rating || '?'}</p>
                          </div>
                        </div>
                        <button 
                          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition"
                          onClick={() => handleChallenge(user.userId)}
                        >
                          Challenge
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-gray-500">
                    {connected ? "No users available to challenge" : "Connecting to server..."}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DuelTest;