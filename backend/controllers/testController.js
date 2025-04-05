import axios from "axios"
import { Test } from "../Schema/testSchema.js";
async function fetchQuestions(difficulty,subject,standard) {
    try {
      const response = await axios({
        url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyBsyTlrlszK8-o5EDjbMEL4mBY4SPQCIkg",
        method: "post",
        data: {
          contents: [
            {
              parts: [
                {
                  text: `return array of objects of size 15 in the format
                  dont add anything extra as i need to parse this object  :
                  {questions = [
  {
    question: "What is 2 + 2?",
    options: ["3", "4", "5", "6"],
    correctAnswer: 1,
  },...]}
                  These should be ${difficulty}-difficulty questions for Class 10 students. of subject ${subject} of class ${standard} also parse it to an array of object`
                }
              ]
            }
          ]
        }
      });
  
      const text = response.data.candidates[0].content.parts[0].text;
      
     // console.log(text.substr(7,text.length-11));
      const json = JSON.parse(text.substr(7,text.length-11)); 
      console.log(json.questions)
      
      return json.questions;
    } catch (error) {
      console.error("Failed to fetch questions:", error.message);
      return [];
    }
  }
export const getQuestions = async (req, res) => {
    const { difficulty, subject, standard } = req.params;
    const questions=await fetchQuestions(difficulty,subject,standard);
    res.json({
        questions: questions
    })
  };

export const testFinished= async (req,res)=>{
  const {userId, subject, score, difficulty}=req.body;
  try {
    const newTest = new Test({
      userId,
      subject,
      score,
      difficulty
    });

    const savedTest = await newTest.save();
    res.status(201).json({
      message: 'Test result saved successfully',
      test: savedTest
    });
  } catch (error) {
    console.error('Error saving test result:', error);
    res.status(500).json({ error: 'Failed to save test result' });
  }
}  
