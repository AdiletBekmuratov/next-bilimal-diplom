import React from "react";

export default function Navbar({ title, navbarOpen, setNavbarOpen }) {
  return (
    <>
      <nav className="flex flex-wrap items-center justify-between py-4 px-5 bg-white text-gray-700 left-0 top-0 border-b border-gray-300 z-40">
        <div className="flex flex-wrap items-center justify-between w-full">
          <h3>{title}</h3>
          <div
            className="cursor-pointer text-lg leading-none px-1 py-1 
							border border-solid border-transparent rounded-full md:hidden outline-none focus:outline-none flex justify-center items-center"
          >
            <button onClick={() => setNavbarOpen(!navbarOpen)}>
              <svg
                className=" w-6 h-6"
                x-show="!showMenu"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}
