import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import NavbarLink from "./NavbarLink";

export default function Navbar() {
  const [navbarOpen, setNavbarOpen] = useState(false);
  const { data: session, status } = useSession();
  const handleNavbarClose = () => {
    setNavbarOpen(false);
  };

  return (
    <>
      <nav className="flex flex-wrap items-center justify-between py-4 navbar bg-base-100 sticky left-0 top-0 shadow-md z-50">
        <div className="container mx-auto px-5 flex flex-wrap items-center justify-between">
          <div className="w-full relative flex justify-between items-center lg:w-auto lg:static lg:block lg:justify-start">
            <Link onClick={handleNavbarClose} href="/">
              <a>
                <Image
                  src="/favicon.ico"
                  alt="logo"
                  height={48}
                  width={48}
                  layout="fixed"
                />
              </a>
            </Link>
            <div
              className="cursor-pointer text-lg leading-none px-1 py-1 
							border border-solid border-transparent rounded-full lg:hidden outline-none focus:outline-none flex justify-center items-center"
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
          <div
            className={`mt-8 lg:mt-0 lg:flex flex-grow items-center ${
              navbarOpen ? " flex" : " hidden"
            }`}
            id="example-navbar-danger"
          >
            <ul className="flex flex-col lg:flex-row lg:space-x-4 lg:space-y-0 space-x-0 space-y-1 list-none lg:ml-auto">
              <NavbarLink
                condition={true}
                onClick={handleNavbarClose}
                href="/products"
                name="Наши товары"
              />

              <NavbarLink
                condition={status === "authenticated"}
                onClick={() => signOut()}
                href="/"
                name="Выйти"
              />
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
