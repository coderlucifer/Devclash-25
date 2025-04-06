import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

function ResultPage() {
  const location = useLocation();
  const { score, answers } = location.state;
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <div className="min-h-screen bg-white py-10 px-4 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Final Score: {score} / {answers.length}</h2>

      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {answers.map((ans, index) => {
          const isCorrect = ans.selectedAnswer === ans.correctAnswer;
          return (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-10 h-10 rounded-full font-semibold ${
                isCorrect ? 'bg-green-500' : 'bg-red-500'
              } text-white hover:scale-105 transition`}
            >
              {index + 1}
            </button>
          );
        })}
      </div>

      {activeIndex !== null && (
        <div className="border rounded-lg p-6 shadow bg-gray-50">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Question {activeIndex + 1}
          </h3>
          <p className="mb-4 text-gray-700">{answers[activeIndex].question}</p>
          <div className="grid gap-3">
            {answers[activeIndex].options.map((opt, idx) => {
              const isCorrect = idx === answers[activeIndex].correctAnswer;
              const isSelected = idx === answers[activeIndex].selectedAnswer;
              return (
                <div
                  key={idx}
                  className={`px-4 py-2 rounded border 
                    ${isCorrect ? 'border-green-500 bg-green-100' : 
                      isSelected ? 'border-red-500 bg-red-100' : 
                      'border-gray-300 bg-white'}`}
                >
                  {opt}
                  {isCorrect && <span className="ml-2 text-green-600 font-semibold">✔ Correct</span>}
                  {isSelected && !isCorrect && <span className="ml-2 text-red-600 font-semibold">✖ Your Pick</span>}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default ResultPage;
