import MainWrapper from "@/components/MainWrapper";
import { useSession } from "next-auth/react";
import { BsFillGearFill } from "react-icons/bs";
import React from "react";
import { Tooltip } from "@mui/material";
import Link from "next/link";

const Profile = () => {
  const { data: session, status } = useSession();
  return (
    <MainWrapper title={"Профиль"}>
      <section className="relative block h-72 md:h-96">
        <div
          className="absolute top-0 w-full h-full bg-center bg-cover rounded-md"
          style={{
            backgroundImage:
              "url('https://source.unsplash.com/random/2710/?nature')",
          }}
        >
          <span
            id="blackOverlay"
            className="w-full h-full absolute opacity-50 bg-black rounded-md"
          ></span>
        </div>
      </section>
      <section className="relative py-16">
        <div className="container mx-auto px-4">
          <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg -mt-64">
            <div className="px-6">
              <div className="flex flex-wrap justify-center">
                <div className="w-full lg:w-3/12 px-4 flex justify-center">
                  <div className="relative">
                    <img
                      alt="..."
                      src={
                        "https://images.unsplash.com/photo-1650217735382-17cc044e37be?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=800&q=80"
                      }
                      className="shadow-lg rounded-full h-auto align-middle border-none -mt-16"
                      style={{ maxWidth: "150px" }}
                    />
                  </div>
                </div>
                <div className="absolute right-8 top-8">
                  <Link href="/edit-profile">
                    <a
                      className="bg-blue-500 active:bg-blue-600 uppercase inline-block text-white font-bold hover:shadow-md shadow text-md p-4 rounded-full outline-none focus:outline-none sm:mr-2 mb-1"
                      style={{ transition: "all .15s ease" }}
                    >
                      <BsFillGearFill />
                    </a>
                  </Link>
                </div>
              </div>
              <div className="text-center mt-8">
                <h3 className="text-base font-semibold leading-normal text-gray-600">
                  {session?.user?.groupName}
                </h3>
                <h3 className="text-4xl font-semibold leading-normal mb-2 text-gray-800">
                  {session?.user?.firstName + " " + session?.user?.lastName}
                </h3>
                <div className="text-sm leading-normal mb-2 text-gray-600 font-bold uppercase">
                  {session?.user?.email}
                </div>
                <div className="mb-2 text-gray-700 mt-10">
                  Solution Manager - Creative Tim Officer
                </div>
                <div className="mb-4 text-gray-700">
                  University of Computer Science
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainWrapper>
  );
};

export default Profile;
