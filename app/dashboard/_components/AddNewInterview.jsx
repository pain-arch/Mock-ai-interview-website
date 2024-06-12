"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { text } from "drizzle-orm/pg-core";
import { chatSession } from "@/utils/GeminiAiModal";
import { LoaderCircle } from "lucide-react";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { v4 as uuidv4 } from 'uuid';
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import { useRouter } from "next/navigation";

function AddNewInterview() {
  const [openDialog, setOpenDialog] = useState(false);
  const [jobPosition, setJobPosition] = useState();
  const [jobDes, setJobDes] = useState();
  const [jobExp, setJobExp] = useState(); 
  const [loading, setLoading] = useState(false);
  const [jsonResponse, setJsonResponse] = useState([]);
  const { user } = useUser();
  const router = useRouter();

  const onSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    console.log(jobPosition, jobDes, jobExp);

    const InputPrompt = "job Position: "+jobPosition+", job Description:"+jobDes+" , Years of Experience: "+jobExp+", Depends on this information please give me "+process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT+" interview question with Answered in Json Format, Give Question and Answered as field in JSON"
    const result = await chatSession.sendMessage(InputPrompt);

    const MockJsonResp = (result.response.text()).replace('```json','').replace('```','');

    setJsonResponse(MockJsonResp)

    if (MockJsonResp) {
      const resp = await db.insert(MockInterview)
        .values({
          mockId: uuidv4(),
          jsonMockResp: MockJsonResp,
          jobPositiopn: jobPosition,
          jobDesc: jobDes,
          jobExperience: jobExp,
          createdBy: user?.primaryEmailAddress?.emailAddress,
          createdAt: moment().format('DD-MM-YYYY')
        }).returning({ mockId: MockInterview.mockId });
    
      console.log("Inserted ID:", resp);
      if (resp) {
        setOpenDialog(false);
        router.push('/dashboard/interview/'+resp[0]?.mockId)
      }
    }
    else {
      console.log("Error in AI response");
    }
    setLoading(false);

  }

  return (
    <div>
      <div
        className="p-10 border rounded-lg bg-secondary 
      hover:scale-105 hover:shadow-md cursor-pointer transition-all"
        onClick={() => setOpenDialog(true)}
      >
        <h2 className="font-bold text-lg text-center">+ Add New</h2>
      </div>

      <Dialog open={openDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Tell us more about your job interviwing
            </DialogTitle>
            <DialogDescription>
              <form onSubmit={onSubmit}>
                <div>
                  <h2>
                    Add Details about your job position/role, job description
                    and years of experience{" "}
                  </h2>
                  <div className="mt-7 my-3">
                    <label>Job Role/Job Position</label>
                    <Input placeholder="Ex. Full Stack Developer" required
                      onChange={(event) => {
                      setJobPosition(event.target.value);
                    }}
                    />
                  </div>
                  <div className=" my-3">
                    <label>Job Description/ Tech Stack (In short)</label>
                    <Input placeholder="Ex. React, Next, Angular, NodeJs, MySql etc" required
                     onChange={(event) => {
                      setJobDes(event.target.value);
                    }}
                    />
                  </div>
                  <div className=" my-3">
                    <label>Years of Experience</label>
                    <Input placeholder="Ex. 5" type="number" max="50" required
                     onChange={(event) => {
                      setJobExp(event.target.value);
                    }}
                    />
                  </div>
                </div>
                <div className="flex gap-5 justify-end">
                  <Button type="button" variant="ghost" onClick={() => setOpenDialog(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    
                    {
                      loading ?
                        <>
                          <LoaderCircle className="animate-spin"/>'Generating from AI'
                        </> : 'Start Interview'
                    }
                    </Button>
                </div>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddNewInterview;
