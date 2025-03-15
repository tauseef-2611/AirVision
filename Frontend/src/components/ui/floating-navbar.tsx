"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";
import Link from "next/link";

export const FloatingNav = ({ className }: { className?: string }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [navItems, setNavItems] = useState([
    {
      name: "Home",
      link: "/",
    },
    {
      name: "AirCheck & Guide",
      link: "/upload-image",
    },
  ]);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setIsLoggedIn(true);
      console.log("Logged in");
      setNavItems((prevItems) => {
        // Check if "Lung Health" is already in the navItems
        if (!prevItems.some(item => item.name === "Lung Health")) {
          return [
            ...prevItems,
            {
              name: "Lung Health",
              link: "/lung-health",
            },
          ];
        }
        return prevItems;
      });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    window.location.href = "/";
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 1, y: -100 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.2 }}
        className={cn(
          "flex max-w-fit fixed top-10 inset-x-0 mx-auto border border-transparent dark:border-white/[0.2] rounded-full dark:bg-black bg-white shadow-md z-[5000] pr-2 pl-8 py-2 items-center justify-center space-x-4",
          className
        )}
      >
        {navItems.map((navItem, idx) => (
          <Link
            key={idx}
            href={navItem.link}
            className="dark:text-neutral-50 text-neutral-600 hover:text-neutral-500"
          >
            {navItem.name}
          </Link>
        ))}

        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="border text-sm font-medium relative border-neutral-200 dark:border-white/[0.2] text-black dark:text-white px-4 py-2 rounded-full"
          >
            <span>Signout</span>
            <span className="absolute inset-x-0 w-1/2 mx-auto -bottom-px bg-gradient-to-r from-transparent via-blue-500 to-transparent h-px" />
          </button>
        ) : (
          <Link href="/signin">
            <button className="border text-sm font-medium relative border-neutral-200 dark:border-white/[0.2] text-black dark:text-white px-4 py-2 rounded-full">
              <span>Signin</span>
              <span className="absolute inset-x-0 w-1/2 mx-auto -bottom-px bg-gradient-to-r from-transparent via-blue-500 to-transparent h-px" />
            </button>
          </Link>
        )}
      </motion.div>
    </AnimatePresence>
  );
};