import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";
import Webcam from "react-webcam";

function RecordAnsSection() {
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
      <Button variant="outline" className="my-10">Record Answer</Button>
    </div>
  );
}

export default RecordAnsSection;
