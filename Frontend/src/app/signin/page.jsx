"use client";
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/utils/cn";
import { useRouter } from "next/navigation";
import { WavyBackground } from "@/components/ui/wavy-background";
import { toast, Toaster } from "sonner";

const BACKEND_URI = process.env.NEXT_PUBLIC_BACKEND_URI;

export default function SignIn() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${BACKEND_URI}/login`, {
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
        toast.success("Signed in successfully");
      } else {
        toast.error("Invalid email or password");
      }
    } catch (error) {
      toast.error("Error: " + error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Toaster position="top-right" />
      <WavyBackground className="w-fit pb-40">
        <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl mt-20 pt-30 p-4 md:p-8 shadow-input bg-white dark:bg-black">
          <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200 mt-12">
            Sign In to AirVision
          </h2>
          <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
            Enter your email and password to sign in
          </p>

          <form className="my-8" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <LabelInputContainer>
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" placeholder="hacker@kmit.com" type="email" onChange={handleChange} value={formData.email} />
              </LabelInputContainer>
              <LabelInputContainer>
                <Label htmlFor="password">Password</Label>
                <Input id="password" placeholder="Password" type="password" onChange={handleChange} value={formData.password} />
              </LabelInputContainer>
              <button
                type="submit"
                className="bg-gradient-to-br from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium"
              >
                Sign In
              </button>
            <p className="text-neutral-600 text-sm mt-4 dark:text-neutral-300">
              Don't have an account?{" "}
              <a href="/signup" className="text-primary-600 dark:text-primary-400 font-semibold">
                Sign Up
              </a>
            </p>
            </div>
          </form>
        </div>
      </WavyBackground>
    </div>
  );
}

const LabelInputContainer = ({ children, className }) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};