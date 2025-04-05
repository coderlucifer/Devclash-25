import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const subjects = ['Mathematics', 'Science', 'English', 'Social Studies'];
const difficulties = ['Easy', 'Medium', 'Hard'];

  

function TestSetup() {
  const [selectedSubject, setSelectedSubject] = useState(subjects[0]);
  const [selectedDifficulty, setSelectedDifficulty] = useState(difficulties[0]);
  const navigate = useNavigate();


  const handleStartTest = () => {
    // Navigate to test page with subject and difficulty parameters
    navigate(`/test?subject=${encodeURIComponent(selectedSubject)}&difficulty=${encodeURIComponent(selectedDifficulty)}`);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="max-w-xl w-full bg-white border border-blue-500 rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Select Test Options</h2>
        
        {/* Subject Selection */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="subject">Select Subject</label>
          <select 
            id="subject"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full border border-gray-300 rounded-lg py-2 px-3"
          >
            {subjects.map((subject, idx) => (
              <option key={idx} value={subject}>{subject}</option>
            ))}
          </select>
        </div>
        
        {/* Difficulty Selection */}
        <div className="mb-6">
          <label className="block text-gray-700 mb-2" htmlFor="difficulty">Select Difficulty</label>
          <select 
            id="difficulty"
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="w-full border border-gray-300 rounded-lg py-2 px-3"
          >
            {difficulties.map((difficulty, idx) => (
              <option key={idx} value={difficulty}>{difficulty}</option>
            ))}
          </select>
        </div>
        
        <button 
          onClick={handleStartTest}
          className="w-full py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition"
        >
          Start Test
        </button>
      </div>
    </div>
  );
}

export default TestSetup;
