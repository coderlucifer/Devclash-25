import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'

function getStandard() {
    const student = localStorage.getItem("student");
    if (!student) return null;
    try {
      return JSON.parse(student).std;
    } catch (error) {
      console.error("Failed to parse student from localStorage", error);
      return null;
    }
  }


function TestPage() {
  const [answers, setAnswers] = useState([]);
  const [testQuestions, setTestQuestions]=useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const searchParams = new URLSearchParams(location.search);
  const subject = searchParams.get('subject');
  const difficulty = searchParams.get('difficulty');
  const student = localStorage.getItem("student");
  const studentData= JSON.parse(student);
  
  const navigate = useNavigate();
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.post(`http://localhost:3000/api/test/fetchquestions/${difficulty}/${subject}/${getStandard()}`);
        console.log(response.data)
        setTestQuestions(response.data.questions);
      } catch (error) {
        console.error("Failed to fetch test questions", error);
      }
    };
  
    fetchQuestions();
  }, [subject, difficulty]);
  
  useEffect(() => {
    // Reset timer for each new question
    setTimeLeft(60);
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timer);
          handleNextQuestion();
          return 60;
        }
        return prevTime - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestionIndex]);

  const handleOptionClick = (selectedOptionIndex) => {
    const isCorrect = selectedOptionIndex === currentQuestion.correctAnswer;
    if (isCorrect) setScore(score + 1);
  
    setAnswers(prev => [
      ...prev,
      {
        question: currentQuestion.question,
        options: currentQuestion.options,
        correctAnswer: currentQuestion.correctAnswer,
        selectedAnswer: selectedOptionIndex,
      }
    ]);
  
    handleNextQuestion();
  };
  
  const submitData= async()=>{
    await axios.post("http://localhost:3000/api/test/finish", {
      userId: studentData._id,
      subject,
      score,
      difficulty,
    });
    
  }
  const handleNextQuestion = () => {
    if (currentQuestionIndex < testQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Test completed – navigate to a results page or display the score.
      submitData();
      navigate('/result', { state: { score, answers } });

    }
  };
  if (!testQuestions.length) {
    return (
      <div className="text-center py-20">
        <p className="text-lg text-gray-700">Loading questions...</p>
      </div>
    );
  }

  const currentQuestion = testQuestions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto py-10">
        <div className="bg-white border border-blue-500 rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Test Page</h2>
            <div className="text-lg font-semibold text-blue-600">
              Time Left: {timeLeft} sec
            </div>
          </div>
          <div className="mb-6">
            <h3 className="text-xl font-medium text-gray-800">
              {`Question ${currentQuestionIndex + 1} of ${testQuestions.length}`}
            </h3>
            <p className="mt-2 text-gray-700">{currentQuestion.question}</p>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleOptionClick(index)}
                className="w-full py-3 px-4 border border-gray-300 rounded-lg hover:bg-blue-100 transition text-gray-800"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TestPage;
