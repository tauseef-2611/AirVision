"use client";

import { useState, useEffect } from "react";
import { FileUpload } from "@/components/ui/file-upload";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { toast, Toaster } from "sonner";
import { useRouter } from "next/navigation";
import GenerateReport from "@/components/GenerateReport";
import { Spotlight } from "@/components/ui/Spotlight";
import { MultiStepLoader as Loader } from "@/components/ui/multi-step-loader";
import { IconSquareRoundedX } from "@tabler/icons-react";
import { SparklesCore } from "@/components/ui/sparkles";

type Prediction = "Good" | "Moderate" | "Severe" | "Irrelevant";

const loadingStates = [
  { text: "Uploading your breath's snapshot..." }, 
  { text: "Sniffing out the air quality..." },    
  { text: "Crafting your personalized air guide..." }, 
];

export default function UploadPage() {
  const router = useRouter();
  const [user, setUser] = useState(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    }
    return null;
  });
  const [showUpload, setShowUpload] = useState(true);
  const [showImage, setShowImage] = useState(false);
  // const [lungHealth, setLungHealth] = useState<string | null>(null);
  const [isPredictionLoading, setIsPredictionLoading] = useState(false);
  const [showPrediction, setShowPrediction] = useState(false);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [lungHealth, setLungHealth] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      if (!localStorage.getItem("token")) {
        toast.error("Please sign in to access this page");
        router.push('/signin');
      }
    }
  }, [router]);

  const handleFileUpload = async (uploadedFiles: File[]) => {
    const imageFile = uploadedFiles.find(file => file.type.startsWith("image/"));

    if (!imageFile) {
      toast.error("Only image files are allowed");
      return;
    }

    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("userId", user.id);

    try {
      setLoading(true);
      const response = await fetch("http://localhost:8000/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        await response.json();
        toast.success("Image uploaded successfully");
        setShowUpload(false);
        setShowImage(true);
      } else {
        toast.error("Failed to upload image");
      }
    } catch (error) {
      toast.error("Error: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const getLungHealth = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8000/lung-health", {
        method: "POST",
        body: JSON.stringify({ userId: user.id }),
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setLungHealth(data);
      } else {
        toast.error("Failed to get Lung Data");
      }
    } catch (error) {
      toast.error("Error: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handlePrediction = async () => {
    try {
      setIsPredictionLoading(true);
      setLoading(true);
      const response = await fetch("http://localhost:8000/predict", {
        method: "POST",
        body: JSON.stringify({ userId: user.id }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setPrediction(data.message as Prediction);
        setShowImage(false);
        setShowUpload(false);
        setIsPredictionLoading(false);

        if (data.message === "Irrelevant" || data.message === null) {
          toast.error("No prediction available for this image");
          setShowUpload(true);
          setShowImage(false);
          setShowPrediction(false);
        } else {
          toast.success("Prediction generated successfully");
          setShowPrediction(true);
        }
      } else {
        toast.error("Failed to generate prediction");
      }
    } catch (error) {
      toast.error("Error: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const getPredictionColor = (prediction: Prediction) => {
    switch (prediction) {
      case "Good":
        return "text-green-500";
      case "Moderate":
        return "text-yellow-500";
      case "Severe":
        return "text-red-500";
      default:
        return "";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100 dark:bg-black">
      <Toaster position="top-right" />
      <div className="w-full h-full fixed inset-0">
        <SparklesCore
          id="tsparticlesfullpage"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={100}
          className="w-full h-full"
          particleColor="#FFFFFF"
        />
      </div>
      <Spotlight />
      
      {loading && (
        <Loader loadingStates={loadingStates} loading={loading} duration={2000} />
      )}
      
      {isPredictionLoading && (
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 mt-200 border-b-2 border-purple-500"></div>
        </div>
      )}
      {showPrediction && prediction !== null && prediction !== "Irrelevant" && (
        <div className="max-w-2xl w-full mx-auto rounded-none md:rounded-2xl mt-20 pt-30 p-4 md:p-8 shadow-input bg-white dark:bg-black">
          <h2 className="text-2xl font-bold text-center mb-4 dark:text-white">
            Your Guidlines
          </h2>
          <div className="text-2xl mb-4 animate-fadeIn animation-delay-200">Name: <span className="font-bold">{user.name}</span></div>
          <div className={`text-2xl mb-4 animate-fadeIn animation-delay-400 ${getPredictionColor(prediction)}`}>
            Pollution Prediction: <span className="font-bold">{prediction}</span>
          </div>
          <GenerateReport user={user} pollution_prediction={prediction} setLoading={setLoading} />
        </div>
      )}
      {showUpload && (
        <div className="w-full max-w-lg p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-center mb-4 dark:text-white">
            Upload Your Image
          </h2>
          <FileUpload onChange={handleFileUpload} />
        </div>
      )}
      {showImage && (
        <CardContainer className="inter-var mt-10">
          <CardBody className="relative bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-700 w-auto sm:w-[30rem] h-auto rounded-xl p-6 shadow-lg">
            <CardItem translateZ="50" className="text-lg font-bold dark:text-white">
              Preview
            </CardItem>
            <CardItem translateZ="100" className="w-full mt-4">
              <img 
                src={`http://localhost:8000/image/${user.id}`} 
                alt="Uploaded Preview"
                className="h-60 w-full object-cover rounded-xl shadow-lg"
              />
            </CardItem>
            <div className="flex justify-center mt-6">
              <button 
                onClick={handlePrediction}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
              >
                Generate
              </button>
            </div>
          </CardBody>
        </CardContainer>
      )}
    </div>
  );
}