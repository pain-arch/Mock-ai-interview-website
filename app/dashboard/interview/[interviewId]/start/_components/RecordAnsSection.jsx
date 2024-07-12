"use client";
import { Button } from "@/components/ui/button";
import { db } from "@/utils/db";
import { chatSession } from "@/utils/GeminiAiModal";
import { UserAnswer } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import { Mic, StopCircle } from "lucide-react";
import moment from "moment";
import Image from "next/image";
import React, { use, useEffect, useState } from "react";
import useSpeechToText from "react-hook-speech-to-text";
import Webcam from "react-webcam";
import { toast } from "sonner";

function RecordAnsSection({ activeQuestionIndex, interviewData, mockInterviewQuestion }) {

  const [userAnswer, setUserAnswer] = useState("");
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  console.log(mockInterviewQuestion)

  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
    setResults,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  useEffect(() => {
    results.map((result) => {
      setUserAnswer((prevAns) => prevAns + result?.transcript);
    });
  }, [results]);

  useEffect(() => {
    if (!isRecording&&userAnswer.length > 10) {
      UpdateUserAnswer();
    }
  }, [userAnswer])

  const StartStopRecording = async() => {
    if (isRecording) {
      
      stopSpeechToText();
      
    } else {
      startSpeechToText();
    }
  };


  const UpdateUserAnswer = async () => {
    console.log(userAnswer);
    setLoading(true);

    const feedbackPrompt =
    "Question:" +
    mockInterviewQuestion[activeQuestionIndex]?.Question +
    "," +
    "User Answer:" +
    userAnswer +
    ",Depends on question and user answer for give interview question " +
    " please give us rating for answer and feedback as area of improvement if any " +
    "in just 3 to 5 lines to improve it in JSON format with rating field and feedback feild";
  
    const result = await chatSession.sendMessage(feedbackPrompt);
    const mockJsonResponse = (result.response.text().replace("```json", "").replace("```", ""));
    
    console.log(mockJsonResponse);

    const JsonFeedbackResp = JSON.parse(mockJsonResponse);

    const resp = await db.insert(UserAnswer).values({
      mockIdRef: interviewData?.mockId,
      question: mockInterviewQuestion[activeQuestionIndex]?.Question,
      correctAns: mockInterviewQuestion[activeQuestionIndex]?.Answer,
      userAns: userAnswer,
      feedback: JsonFeedbackResp?.feedback,
      rating: JsonFeedbackResp?.rating,
      userEmail: user?.primaryEmailAddress?.emailAddress,
      createdAt: moment().format("DD-MM-YYYY"),
    })

    if (resp) {
      toast("Answer Saved Successfully");
      setUserAnswer("");
      setResults([]);
    }
    setResults([]);
    setLoading(false);

  }


  return (
    <div className="flex items-center justify-center flex-col">
      <div className="flex flex-col mt-20 bg-black justify-center items-center rounded-lg p-5">
        <Image
          className="absolute"
          src={"/webcam.png"}
          width={200}
          height={200}
        />
        <Webcam
          mirrored={true}
          style={{
            height: 300,
            width: "100%",
            zIndex: 10,
          }}
        />
      </div>
      <Button disabled={loading} variant="outline" className="my-10" onClick={StartStopRecording}>
        {isRecording ? (
          <h2 className="text-red-600 animate-pulse flex gap-2 items-center">
            <StopCircle />
            Stop Recording
          </h2>
        ) : (
          <h2 className="text-primary flex gap-2 items-center">
          <Mic />
          Record Answer
        </h2>
        )}
      </Button>
    </div>
  );
}

export default RecordAnsSection;
