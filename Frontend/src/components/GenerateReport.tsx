import React, { useEffect, useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";

interface ReportProps {
  user: {
    id: string;
    name: string;
    age: number;
    gender: "Male" | "Female";
    smoker_status: "Never" | "Former" | "Current";
    occupation?: string;
    allergies?: string;
  };
  pollution_prediction?: "Good" | "Moderate" | "Severe" | "Irrelevant"; 
  setLoading: (loading: boolean) => void;
}

export default function GenerateReport({ user, pollution_prediction, setLoading }: ReportProps) {
  
  const [report, setReport] = useState<string>("");
  
  useEffect(() => {
    const generateHealthGuidelines = async () => {
      setLoading(true); // Start loading
      try {
        const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_API_KEY as string); 
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); 
        console.log("Model initialized:", model);
        const chat = model.startChat({
          history: [
            {
              role: "user", 
              parts: [
                {
                  text: `You are an expert health advisor specializing in environmental health impacts. \
Your primary role is to generate personalized and actionable health guidelines. \
These guidelines are based on a user's profile and the predicted pollution level in their environment. \
Focus specifically on the health risks associated with the given pollution level (Low, Moderate, or Heavy) \
and provide recommendations to mitigate these risks.`,
                },
              ],
            },
            {
              role: "model", 
              parts: [
                {
                  text: `
Generate a health report for the following individual:

**User Profile:**
- Name: ${user.name}
- Age: ${user.age}
- Gender: ${user.gender}
- Smoker Status: ${user.smoker_status}
- Occupation: ${user.occupation || "Not specified"}
- Allergies: ${user.allergies || "None"}
- Pollution Level: ${pollution_prediction} (Predicted as: ${pollution_prediction})

Instructions for Health Guidelines:

1. Report Title: Start the report with the title: "Health Guidelines for ${user.name}".
2. Pollution Level Summary: Immediately following the title, provide a concise, two-line summary that describes the potential health implications based *only* on the "${pollution_prediction}" pollution level. Do not consider any other user profile information in this summary.
3. Analyze Risks: Carefully analyze the user's profile in conjunction with the "${pollution_prediction}" pollution level to identify potential health risks.
4. Actionable Advice: Provide clear, actionable, and personalized health guidelines. These should include lifestyle modifications, dietary recommendations, and practical precautions for reducing exposure to pollutants.
5. Tailor Recommendations: Ensure recommendations are specifically tailored to the user's age, gender, smoking status, allergies, and occupation.
6. Numbered List Format: Format the subsequent health guidelines as a numbered list. Do not use any Markdown list markers (like \`1.\`, \`*\`, \`-\`, etc.). Simply start each guideline with the number followed by a period and a space.
7. Explanation for Each Point: Include a brief, concise explanation after each recommendation, justifying its importance based on the user's profile and pollution level.
8. No Markdown Formatting: Ensure that the entire report, including the title, summary, numbered list, and explanations, contains no Markdown formatting characters whatsoever.

Generate the report now.`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.5, 
            topP: 0.9,
            topK: 40, 
            maxOutputTokens: 300,
          },
        });

        const sendMessage = async () => {
          try {
            const result = await chat.sendMessage("Generate personalized health guidelines based on the provided profile and instructions.");
            const response = await result.response;
            const text = await response.text();
            console.log("Generated Guidelines:\n", text);
            setReport(text);
          } catch (error) {
            console.error("Error generating health guidelines:", error);
            setReport(`Error generating report. Please try again later.`); 
          } finally {
            setLoading(false);
          }
        };

        sendMessage(); 
      } catch (error) {
        console.error("Error initializing chat:", error);
        setReport(`Error initializing chat. Please try again later.`); 
        setLoading(false);
      }
    };

    if ( user && pollution_prediction) { 
      generateHealthGuidelines();
    } else {
      setReport("API Key or user/pollution data missing. Check console for details.");
      setLoading(false); 
    }
  }, [user, pollution_prediction, setLoading]); 

  return (
    <div>
      {report ? (
        <TextGenerateEffect words={report} className="font-light" />
      ) : (
        <div>Waiting to generate report. Ensure API key and data are provided.</div> 
      )}
    </div>
  );
}