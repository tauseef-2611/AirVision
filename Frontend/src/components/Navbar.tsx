'use client';
import React, { useState, useEffect } from 'react';
import { FloatingNav } from './ui/floating-navbar';

type NavItem = {
  name: string;
  link: string;
  action?: () => void;
};

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

  const navItems: NavItem[] = [
    {
      name: "Home",
      link: "/",
    },
    {
      name: "AirCheck",
      link: "/upload-image",
    },
    isLoggedIn
      ? {
          name: "Sign Out",
          link: "/",
          action: handleLogout,
        }
      : {
          name: "Sign In",
          link: "/signin",
        },
  ].filter(Boolean); // Filter out false values

  return <FloatingNav navItems={navItems} />;
}

export default Navbar;