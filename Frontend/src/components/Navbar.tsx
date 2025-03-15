'use client';
import React, { useState, useEffect } from 'react';
import { IconHome, IconMessage, IconUser, IconLogout, IconCloud } from "@tabler/icons-react";
import { FloatingNav } from './ui/floating-navbar';

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('token'));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    window.location.href = '/';
  };

  const navItems = [
    {
      name: "Home",
      link: "/",
      icon: <IconHome className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
      name: "AirCheck & Guide",
      link: "/upload-image",
      icon: <IconCloud className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    isLoggedIn
      && {
          name: "Lung Health",
          link: "/lung-health",
          icon: <IconLogout className="h-4 w-4 text-neutral-500 dark:text-white" />, 
          action: handleLogout,
      },
  ];

  return <FloatingNav navItems={navItems} />;
}

export default Navbar;
