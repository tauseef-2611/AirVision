"use client";
import { useEffect } from "react";
import { motion, stagger, useAnimate } from "framer-motion";
import { cn } from "@/utils/cn";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export const TextGenerateEffect = ({
  words,
  className,
}: {
  words: string;
  className?: string;
}) => {
  const [scope, animate] = useAnimate();
  // Split by both spaces and newline characters
  const parts = words.split(/(\s+|\n)/).filter(part => part.length > 0);

  useEffect(() => {
    animate(
      scope.current?.querySelectorAll("span"), // Target only span elements
      {
        opacity: 1,
      },
      {
        duration: 2,
        delay: stagger(0.2),
      }
    );
  }, [scope.current, animate]); // Add animate to dependency array

  const renderParts = () => {
    return (
      <motion.div ref={scope} style={{ whiteSpace: 'pre-wrap' }}> {/* Preserve whitespace and line breaks */}
        {parts.map((part, idx) => {
          if (part === "\n") {
            return <br key={`br-${idx}`} />;
          } else if (/\s+/.test(part)) {
            return <span key={`space-${idx}`}>{part}</span>; // Keep spaces as spans for potential animation if needed
          } else {
            return (
              <motion.span
                key={`word-${idx}`}
                className="dark:text-white text-black opacity-0"
              >
                {part}
              </motion.span>
            );
          }
        })}
      </motion.div>
    );
  };

  return (
    <div className={cn("font-light", className)}>
      <div className="mt-4">
        <div className="dark:text-white text-black text-2xl leading-snug tracking-wide">
          {renderParts()}
        </div>
      </div>
    </div>
  );
};