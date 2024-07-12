"use client";
import { Lightbulb, Volume2 } from "lucide-react";
import React from "react";

function QuestionsSection({ mockInterviewQuestion, activeQuestionIndex }) {
  
  const textToSpeech = (text) => {
      if ('speechSynthesis' in window) {
        const speech = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(speech)
      }
      else {
        alert("Sorry, your browser doesn't support text to speech!")
      }
  }

  return mockInterviewQuestion && (
    <div className="p-5 border rounded-lg my-10">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {mockInterviewQuestion &&
          mockInterviewQuestion?.map((question, index) => (
            <h2
              className={`p-2 border rounded-full text-xs md:text-sm text-center cursor-pointer ${
                activeQuestionIndex == index && "text-white bg-primary"
              }`}
            >Question #{index + 1}</h2>
          ))}
      </div>

      <h2 className="my-5 text-md md:text-lg">{mockInterviewQuestion[activeQuestionIndex]?.Question}</h2>
      <Volume2 className="cursor-pointer" onClick={()=>textToSpeech(mockInterviewQuestion[activeQuestionIndex]?.Question)}/>
      <div className="border rounded-lg p-5 bg-blue-100 mt-20">
        <h2 className="flex gap-2 items-center text-primary">
          <Lightbulb />
          <strong>Note: </strong>
        </h2>
        <h2 className="text-sm text-primary my-2">{process.env.NEXT_PUBLIC_INFORMATION}</h2>
      </div>

    </div>
  );
}

export default QuestionsSection;



// const feedbackPrompt =
//       "Question:" +
//       mockInterviewQuestion[activeQuestionIndex]?.Question +
//       "," +
//       "Answer:" +
//       userAnswer +
//       ",Depends on question and user answer for give interview question " +
//       " please give us rating for answer and feedback as area of improvement if any " +
//       "in just 3 to 5 lines to improve it in JSON format with rating field and feedback feild";

//     const result = await chatSession.sendMessage(feedbackPrompt);

//     const mockJsonResponse = result.response
//       .text()
//       .replace("```json", "")
//       .replace("```", "");
//     console.log(mockJsonResponse);
//     const JsonFeedbackResp = JSON.parse(mockJsonResponse);

//     const resp = await db.insert(UserAnswer).values({
//       mockIdRef: interviewData.mockId,
//       question: mockInterviewQuestion[activeQuestionIndex]?.Question,
//       correctAns: mockInterviewQuestion[activeQuestionIndex]?.Answer,
//       userAns: userAnswer,
//       feedback: JsonFeedbackResp?.feedback,
//       rating: JsonFeedbackResp?.rating,
//       userEmail: user?.primaryEmailAddress?.emailAddress,
//       createdAt: moment().format("DD-MM-YYYY"),
//     });

//     if (resp) {
//       toast("Your answer has been saved successfully");
//     }
//     setUserAnswer("");
//     setLoading(false);