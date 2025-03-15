"use client";
import React, { useState } from "react";
import { FileUpload } from "@/components/ui/file-upload";
import { toast, Toaster } from "sonner";

export function FileUploadDemo() {
  const [files, setFiles] = useState<File[]>([]);

  const handleFileUpload = (uploadedFiles: File[]) => {
    const imageFiles = uploadedFiles.filter(file => file.type.startsWith("image/"));
    if (imageFiles.length !== uploadedFiles.length) {
      toast.error("Only image files are allowed");
      return;
    }
    setFiles(imageFiles);
    console.log(imageFiles);
  };

  const handleSubmit = async () => {
    if (files.length === 0) {
      toast.error("Please select an image to upload");
      return;
    }

    const formData = new FormData();
    files.forEach(file => formData.append("images", file));

    try {
      const response = await fetch("http://localhost:8000/upload-image", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        toast.success("Image uploaded successfully");
      } else {
        toast.error("Failed to upload image");
      }
    } catch (error) {
      toast.error("Error: " + (error as Error).message);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto min-h-96 border border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg">
      <Toaster position="top-right" />
      <FileUpload onChange={handleFileUpload} />
      <button
                  type="button"
                  className="bg-gradient-to-br from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium"
                  onClick={handleSubmit}
                >
                  Next &rarr;
                </button>
    </div>
  );
}