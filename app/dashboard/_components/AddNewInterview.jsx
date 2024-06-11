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

function AddNewInterview() {
  const [openDialog, setOpenDialog] = useState(false);
  const [jobPosition, setJobPosition] = useState();
  const [jobDes, setJobDes] = useState();
  const [jobExp, setJobExp] = useState(); 
  const [loading, setLoading] = useState(false);
  

  const onSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    console.log(jobPosition, jobDes, jobExp);

    const InputPrompt = "job Position: "+jobPosition+", job Description:"+jobDes+" , Years of Experience: "+jobExp+", Depends on this information please give me "+process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT+" interview question with Answered in Json Format, Give Question and Answered as field in JSON"
    const result = await chatSession.sendMessage(InputPrompt);

    const MockJsonResp = (result.response.text()).replace('```json','').replace('```','');

    console.log(JSON.parse(MockJsonResp));
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
                    Start Interview</Button>
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
