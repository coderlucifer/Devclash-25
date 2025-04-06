import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSocket } from '../context/SocketContext';

const DuelPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { socket, connected } = useSocket();
  
  // Read values passed via navigation state
  const { userId, roomId, subject, difficulty } = location.state || {};
  
  // Game State
  const [question, setQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [isWaiting, setIsWaiting] = useState(true);
  const [opponentName, setOpponentName] = useState(null);

  // Results
  const [roundResults, setRoundResults] = useState([]);
  const [finalResults, setFinalResults] = useState(null);
  const [score, setScore] = useState({ player: 0, opponent: 0 });
  const [currentRound, setCurrentRound] = useState(0);

  // Validate required props
  useEffect(() => {
    if (!userId || !roomId) {
      alert("Missing required duel information");
      navigate("/duel-test");
      return;
    }
    
    // Join the duel room when socket is ready
    if (connected) {
      setIsWaiting(true);
      socket.emit("join-duel", { 
        userId, 
        roomId,
        subject,
        difficulty
      });
    }
  }, [userId, roomId, navigate, connected, socket, subject, difficulty]);

  // Setup socket listeners for duel events
  useEffect(() => {
    if (!socket) return;

    const handleNewQuestion = (data) => {
      setQuestion(data.question);
      setOptions(data.options);
      setStartTime(data.startTime);
      setTimeLeft(data.duration);
      setHasAnswered(false);
      setRoundResults([]);
      setIsWaiting(false);
      setCurrentRound(prev => prev + 1);
    };

    const handleResult = (results) => {
      setRoundResults(results);
      
      // Update scores
      const newScore = {...score};
      results.forEach(result => {
        if (result.userId === userId) {
          newScore.player += result.points;
        } else {
          newScore.opponent += result.points;
          // Get opponent name if we don't have it yet
          if (!opponentName) {
            setOpponentName(result.username);
          }
        }
      });
      setScore(newScore);
      
      // Clear question state
      setQuestion(null);
      setOptions([]);
      setStartTime(null);
    };

    const handleFinalResult = (data) => {
      setFinalResults(data);
      setIsWaiting(false);
      setQuestion(null);
      setOptions([]);
      setStartTime(null);
      setHasAnswered(false);
    };

    const handleOpponentLeft = () => {
      alert("Your opponent left the duel!");
      navigate("/duel-test");
    };

    const handleOpponentJoined = (data) => {
      setOpponentName(data.username);
      setIsWaiting(false);
    };

    socket.on("new-question", handleNewQuestion);
    socket.on("result", handleResult);
    socket.on("final-result", handleFinalResult);
    socket.on("opponent-left", handleOpponentLeft);
    socket.on("opponent-joined", handleOpponentJoined);
    socket.on("waiting-for-opponent", () => setIsWaiting(true));

    return () => {
      socket.off("new-question", handleNewQuestion);
      socket.off("result", handleResult);
      socket.off("final-result", handleFinalResult);
      socket.off("opponent-left", handleOpponentLeft);
      socket.off("opponent-joined", handleOpponentJoined);
      socket.off("waiting-for-opponent");
    };
  }, [socket, userId, score, opponentName, navigate]);

  // Timer logic
  useEffect(() => {
    if (!startTime || roundResults.length > 0) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = Math.ceil((startTime + 15000 - now) / 1000);

      if (diff <= 0) {
        clearInterval(interval);
        setTimeLeft(0);
      } else {
        setTimeLeft(diff);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [startTime, roundResults]);

  const sendAnswer = (answerIdx) => {
    if (hasAnswered || !socket) return;
    setHasAnswered(true);

    socket.emit("answer", { 
      roomId, 
      userId, 
      answer: answerIdx 
    });
  };

  const exitDuel = () => {
    navigate("/duel-test");
  };

  const playAgain = () => {
    // Reset states
    setFinalResults(null);
    setRoundResults([]);
    setScore({ player: 0, opponent: 0 });
    setCurrentRound(0);
    setIsWaiting(true);
    
    // Join a new duel with the same details
    if (socket) {
      socket.emit("join-duel", { 
        userId, 
        roomId: `${roomId}-rematch-${Date.now()}`,
        subject,
        difficulty
      });
    }
  };

  // Loading state
  if (!connected) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
        <div className="text-xl font-semibold mb-4">Connecting to server...</div>
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      {/* Header with back button */}
      <div className="w-full max-w-2xl flex justify-between items-center mb-6">
        <button 
          onClick={exitDuel}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Exit Duel
        </button>
        <h1 className="text-2xl font-bold">⚔️ MCQ Duel</h1>
        <div className="w-24 text-right">
          {subject && <span className="text-sm font-medium">{subject}</span>}
        </div>
      </div>

      {/* Score Display */}
      <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-2xl mb-4">
        <div className="flex justify-between items-center">
          <div className="text-center">
            <div className="text-sm text-gray-500">You</div>
            <div className="text-2xl font-bold">{score.player}</div>
          </div>
          
          <div className="text-center">
            <div className="text-sm text-gray-500">Round</div>
            <div className="text-lg font-medium">{currentRound}/10</div>
          </div>
          
          <div className="text-center">
            <div className="text-sm text-gray-500">{opponentName || "Opponent"}</div>
            <div className="text-2xl font-bold">{score.opponent}</div>
          </div>
        </div>
      </div>

      {/* Game Content */}
      {isWaiting ? (
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl text-center">
          <div className="animate-pulse mb-4">
            <div className="h-16 w-16 mx-auto rounded-full bg-blue-200 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h2 className="text-xl font-semibold mb-2">Waiting for opponent...</h2>
          <p className="text-gray-600">Stay tuned, the duel will begin shortly!</p>
        </div>
      ) : finalResults ? (
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl">
          <h2 className="text-xl font-bold mb-4 text-center">Final Results</h2>
          
          <div className="mb-6 text-center">
            <div className="text-3xl font-bold mb-2">
              {finalResults.winner === userId ? "You Win! 🏆" : "You Lose"}
            </div>
            <p className="text-gray-600">
              Final Score: {score.player} - {score.opponent}
            </p>
          </div>
          
          <div className="flex space-x-4">
            <button
              onClick={playAgain}
              className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Play Again
            </button>
            <button
              onClick={exitDuel}
              className="flex-1 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Exit
            </button>
          </div>
        </div>
      ) : question ? (
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl">
          {/* Timer */}
          <div className="flex justify-center mb-4">
            <div className={`text-lg font-bold py-1 px-6 rounded-full ${
              timeLeft > 10 ? 'bg-green-100 text-green-800' : 
              timeLeft > 5 ? 'bg-yellow-100 text-yellow-800' : 
              'bg-red-100 text-red-800'
            }`}>
              {timeLeft} seconds
            </div>
          </div>
          
          {/* Question */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Question {currentRound}:</h3>
            <p className="text-gray-800">{question}</p>
          </div>
          
          {/* Options */}
          <div className="grid grid-cols-1 gap-3">
            {options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => sendAnswer(idx)}
                disabled={hasAnswered}
                className={`w-full py-3 px-4 border rounded-lg text-left transition
                  ${hasAnswered ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-50'}
                  ${hasAnswered ? 'bg-gray-100' : 'bg-white'}`}
              >
                <span className="font-medium">{String.fromCharCode(65 + idx)}.</span> {option}
              </button>
            ))}
          </div>
        </div>
      ) : roundResults.length > 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl">
          <h2 className="text-xl font-bold mb-4 text-center">Round Results</h2>
          
          <div className="space-y-4 mb-6">
            {roundResults.map((result, index) => {
              const isPlayer = result.userId === userId;
              return (
                <div 
                  key={index} 
                  className={`p-4 rounded-lg ${
                    result.correct 
                      ? 'bg-green-50 border border-green-200' 
                      : 'bg-red-50 border border-red-200'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-medium">{isPlayer ? 'You' : opponentName || 'Opponent'}</span>
                      <span className="ml-2">
                        {result.correct ? '✓ Correct' : '✗ Incorrect'}
                      </span>
                    </div>
                    <div className="font-bold">
                      {result.points} pts
                    </div>
                  </div>
                  {result.correct && (
                    <div className="text-sm text-gray-600 mt-1">
                      Answered in {result.timeTaken.toFixed(1)} seconds
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          <div className="text-center text-gray-600">
            Next question coming soon...
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default DuelPage;