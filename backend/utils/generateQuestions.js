import axios from "axios";

export async function fetchQuestions() {
  try {
    const response = await axios({
      url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyBsyTlrlszK8-o5EDjbMEL4mBY4SPQCIkg",
      method: "post",
      data: {
        contents: [
          {
            parts: [
              {
                text: `return array of objects in the format
                dont add anything extra as i need to parse this object  :
                {
                  "questions":[
                    {
                  "Question": "...",
                  "option1": "...",
                  "option2": "...",
                  "option3": "...",
                  "option4": "...",
                  "correctOptionNumber": 1 // 1-4
                },....
                  ]
                }
                These should be medium-difficulty questions for Class 10 students. of subject science and maths also parse it to an array of object`
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


