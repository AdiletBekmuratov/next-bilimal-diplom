import MainWrapper from "@/components/MainWrapper";
import { getCurrentUser, getGroupInfo } from "@/helpers/requests";
import getImageURL from "@/helpers/getImageURL";
import { getSession, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import { BsFillGearFill } from "react-icons/bs";
import { useQuery } from "react-query";
import Head from "next/head";

const Profile = ({ currentUser, currentGroup }) => {
  const { data: session, status } = useSession();
  const { data, isLoading, error } = useQuery(
    "currentUser",
    () => getCurrentUser(session?.user?.accessToken),
    {
      initialData: currentUser,
    }
  );

  const { data: groupData } = useQuery(
    "currentGroups",
    () => getGroupInfo(session?.user?.accessToken, session?.user?.groupId),
    {
      initialData: currentGroup,
    }
  );

  return (
    <>
      <Head>
        <title>Профиль</title>
      </Head>
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
            <div className="relative flex flex-col min-w-0 break-words bg-white w-full p-6 shadow-lg rounded-lg -mt-64">
              <div className="px-6">
                <div className="flex flex-wrap justify-center">
                  <div className="w-full lg:w-3/12 px-4 flex justify-center">
                    <div className="relative">
                      <img
                        alt="profile-image"
                        src={
                          getImageURL(
                            data?.avatar,
                            "fit=cover&width=150&height=150"
                          ) ??
                          "https://img.icons8.com/ios/150/150/user-male-circle.png"
                        }
                        className="shadow-lg rounded-full h-auto align-middle border-none -mt-24 bg-white"
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
                    {groupData?.name}
                  </h3>
                  <h3 className="text-4xl font-semibold leading-normal mb-2 text-gray-800">
                    {data?.first_name + " " + data?.last_name}
                  </h3>
                  <div className="text-sm leading-normal mb-2 text-gray-600 font-bold uppercase">
                    {data?.email}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </MainWrapper>
    </>
  );
};

export async function getServerSideProps(ctx) {
  const session = await getSession(ctx);
  const currentUser = await getCurrentUser(session?.user?.accessToken);
  const currentGroup = await getGroupInfo(
    session?.user?.accessToken,
    session?.user?.groupId
  );
  return { props: { currentUser, currentGroup } };
}

export default Profile;
