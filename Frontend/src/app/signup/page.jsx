"use client";
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue, // Import SelectValue
} from "@/components/ui/select";
import { cn } from "@/utils/cn";
import { useRouter } from "next/navigation";
import { WavyBackground } from "@/components/ui/wavy-background";
import { toast } from "sonner";

const BACKEND_URI = process.env.NEXT_PUBLIC_BACKEND_URI;

export default function TryNow() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    age: "",
    gender: "",
    smokerStatus: "",
    occupation: "",
    allergies: "",
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

    try {
      const response = await fetch(`${BACKEND_URI}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        localStorage.setItem("token", result.token);
        localStorage.setItem("user", JSON.stringify(result.data));
        router.push("/upload-image");
        toast.success("Signed up successfully");
        console.log("Form submitted");
      } else {
        toast.error("Failed to sign up");
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
        <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl mt-20 pt-30 p-4 md:p-8 shadow-input bg-white dark:bg-black">
          {step === 1 && (
            <>
              <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200 mt-12">
                Sign Up to AirVision
              </h2>
              <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
                Create an account to get started with AirVision
              </p>
            </>
          )}

          <form className="my-8" onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="space-y-4">
                <LabelInputContainer>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    placeholder="hacker@kmit.com"
                    type="email"
                    onChange={handleChange}
                    value={formData.email}
                  />
                </LabelInputContainer>
                <LabelInputContainer>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    placeholder="Password"
                    type="password"
                    onChange={handleChange}
                    value={formData.password}
                  />
                </LabelInputContainer>
                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    onValueChange={(value) => handleSelectChange("gender", value)}
                    value={formData.gender}
                  >
                    <SelectTrigger id="gender" className="input">
                      <SelectValue placeholder="Select Gender" /> {/* Replaced <option> with SelectValue */}
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
                <div className="flex space-x-4">
                  <LabelInputContainer>
                    <Label htmlFor="name">Full name</Label>
                    <Input
                      id="name"
                      placeholder="Harshit"
                      type="text"
                      onChange={handleChange}
                      value={formData.name}
                    />
                  </LabelInputContainer>
                  <LabelInputContainer>
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      placeholder="18"
                      type="number"
                      onChange={handleChange}
                      value={formData.age}
                    />
                  </LabelInputContainer>
                </div>
                <div className="flex space-x-4">
                  <LabelInputContainer>
                    <Label htmlFor="smokerStatus">Smoker Status</Label>
                    <Select
                      onValueChange={(value) => handleSelectChange("smokerStatus", value)}
                      value={formData.smokerStatus}
                    >
                      <SelectTrigger id="smokerStatus" className="input">
                        <SelectValue placeholder="Select Smoker Status" /> {/* Replaced <option> with SelectValue */}
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Never">Never</SelectItem>
                        <SelectItem value="Former">Former</SelectItem>
                        <SelectItem value="Current">Current</SelectItem>
                      </SelectContent>
                    </Select>
                  </LabelInputContainer>
                </div>
                <LabelInputContainer>
                  <Label htmlFor="occupation">Occupation</Label>
                  <Input
                    id="occupation"
                    placeholder="Occupation"
                    type="text"
                    onChange={handleChange}
                    value={formData.occupation}
                  />
                </LabelInputContainer>
                <LabelInputContainer>
                  <Label htmlFor="allergies">Allergies</Label>
                  <Input
                    id="allergies"
                    placeholder="Allergies (comma-separated)"
                    type="text"
                    onChange={handleChange}
                    value={formData.allergies}
                  />
                </LabelInputContainer>
                <div className="flex justify-between space-x-2">
                  <button
                    type="button"
                    className="bg-gradient-to-br from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-8 p-2 text-white rounded-md h-10 font-medium "
                    onClick={handleBack}
                  >
                    &larr;
                  </button>
                  <button
                    type="submit"
                    className="bg-gradient-to-br from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium mx-5"
                  >
                    Sign up
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