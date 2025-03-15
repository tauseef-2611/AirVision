"use client";
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/utils/cn";
import { useRouter } from "next/navigation";
import { WavyBackground } from "@/components/ui/wavy-background";
import { toast } from "sonner";

const BACKEND_URI = process.env.NEXT_PUBLIC_BACKEND_URI;

export default function LungHealth() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    lung_condition: "",
    fev1: "",
    fvc: "",
    exercise_level: "",
    symptoms: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSelectChange = (id, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${BACKEND_URI}/lung-health`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        toast.success("Lung health data submitted successfully");
        console.log("Form submitted");
      } else {
        toast.error("Failed to submit lung health data");
        console.error("Failed to submit form");
      }
    } catch (error) {
      toast.error("Error: " + error.message);
      console.error("Error:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <WavyBackground className="w-fit pb-40">
        <div className="max-w-50 w-full mx-auto px-36 rounded-none md:rounded-2xl mt-20 pt-30 p-4 md:p-8 shadow-input bg-white dark:bg-black">
          {step === 1 && (
            <>
              <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200 mt-12">
                Lung Health Data
              </h2>
              <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
                Provide your lung health data
              </p>
            </>
          )}

          <form className="my-8" onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="space-y-4">
                <LabelInputContainer>
                  <Label htmlFor="lung_condition">Lung Condition</Label>
                  <Input
                    id="lung_condition"
                    placeholder="e.g., Asthma, COPD"
                    type="text"
                    onChange={handleChange}
                    value={formData.lung_condition}
                  />
                </LabelInputContainer>
                <LabelInputContainer>
                  <Label htmlFor="fev1">FEV1</Label>
                  <Input
                    id="fev1"
                    placeholder="FEV1 value"
                    type="number"
                    onChange={handleChange}
                    value={formData.fev1}
                  />
                </LabelInputContainer>
                <button
                  type="button"
                  className="bg-gradient-to-br from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium"
                  onClick={handleNext}
                >
                  Next &rarr;
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4 mt-16">
                <LabelInputContainer>
                  <Label htmlFor="fvc">FVC</Label>
                  <Input
                    id="fvc"
                    placeholder="FVC value"
                    type="number"
                    onChange={handleChange}
                    value={formData.fvc}
                  />
                </LabelInputContainer>
                <LabelInputContainer>
                  <Label htmlFor="exercise_level">Exercise Level</Label>
                  <Select
                    onValueChange={(value) => handleSelectChange("exercise_level", value)}
                    value={formData.exercise_level}
                  >
                    <SelectTrigger id="exercise_level" className="input">
                      <SelectValue placeholder="Select Exercise Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Moderate">Moderate</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                    </SelectContent>
                  </Select>
                </LabelInputContainer>
                <LabelInputContainer>
                  <Label htmlFor="symptoms">Symptoms</Label>
                  <Input
                    id="symptoms"
                    placeholder="e.g., Shortness of breath, Cough"
                    type="text"
                    onChange={handleChange}
                    value={formData.symptoms}
                  />
                </LabelInputContainer>
                <div className="flex justify-between space-x-2">
                  <button
                    type="button"
                    className="bg-gradient-to-br from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-8 p-2 text-white rounded-md h-10 font-medium"
                    onClick={handleBack}
                  >
                    &larr; 
                  </button>
                  <button
                    type="submit"
                    className="bg-gradient-to-br from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium mx-5"
                  >
                    Submit
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </WavyBackground>
    </div>
  );
}

const LabelInputContainer = ({ children, className }) => {
  return <div className={cn("flex flex-col space-y-2 w-full", className)}>{children}</div>;
};