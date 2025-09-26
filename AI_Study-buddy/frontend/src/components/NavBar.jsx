import React, { useEffect, useState, useRef } from "react";

const Navbar = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setLoggedIn(!!localStorage.getItem("token"));
    const onStorage = () => setLoggedIn(!!localStorage.getItem("token"));
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDropdown]);

  const handleLogout = async () => {
    // Optional: Call backend logout endpoint if you have one
    // await fetch("http://localhost:5000/api/v1/auth/logout", { method: "POST", ... });

    localStorage.removeItem("token");
    setLoggedIn(false);
    setShowDropdown(false);
    window.location.href = "/login";
  };

  return (
    <header className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
      <nav className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="text-2xl font-bold text-indigo-600">
          Rentora
        </a>

        {/* Navigation - hidden on mobile */}
        <ul className="hidden md:flex space-x-6 font-medium text-gray-700">
          <li>
            <a href="#home" className="hover:text-indigo-600">
              Home
            </a>
          </li>
          <li>
            <a href="#about" className="hover:text-indigo-600">
              About 
            </a>
          </li>
          <li>
            <a href="#dashboard" className="hover:text-indigo-600">
              Users
            </a>
          </li>
        </ul>

        {/* Buttons & Profile */}
        <div className="flex space-x-4 items-center relative">
          {!loggedIn && (
            <>
              {/* Login button - hidden on mobile */}
              <a
                href="/login"
                className="hidden md:inline text-indigo-600 border border-indigo-600 px-4 py-1.5 rounded hover:bg-indigo-50"
              >
                Login
              </a>
              {/* Sign Up button - always visible */}
              <a
                href="/register"
                className="bg-indigo-600 text-white px-4 py-1.5 rounded hover:bg-indigo-700"
              >
                Sign Up
              </a>
            </>
          )}
          {loggedIn && (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown((v) => !v)}
                className="ml-2 focus:outline-none"
                aria-label="Profile"
              >
                {/* Simple profile icon (SVG) */}
                <svg
                  className="w-8 h-8 text-indigo-600 rounded-full border border-indigo-200 bg-indigo-50 p-1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="8" r="4" />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 20c0-2.21 3.582-4 8-4s8 1.79 8 4"
                  />
                </svg>
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-lg z-10">
                  <a
                    href="/profile"
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Profile
                  </a>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
