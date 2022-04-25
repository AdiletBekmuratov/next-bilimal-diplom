import React, { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const MainWrapper = ({ title, children }) => {
  const [navbarOpen, setNavbarOpen] = useState(false);

  return (
    <>
      <div className="flex w-screen h-screen">
        <Sidebar navbarOpen={navbarOpen} setNavbarOpen={setNavbarOpen} />
        <div className="flex flex-col flex-1 ">
          <Navbar
            navbarOpen={navbarOpen}
            setNavbarOpen={setNavbarOpen}
            title={title}
          />
          <div className="flex flex-col flex-1 p-5 overflow-auto bg-gray-50 text-gray-700">
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

export default MainWrapper;
