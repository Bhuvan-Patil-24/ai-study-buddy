import React from "react";
import Navbar from "../components/NavBar";

const MainLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-6">{children}</main>
    </>
  );
};

export default MainLayout;
