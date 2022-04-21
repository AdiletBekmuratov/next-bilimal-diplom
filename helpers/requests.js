import axios from "axios";

export const getCurrentUser = async (accessToken = "") => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/users/me?fields=id,first_name,last_name,email,role,avatar,group`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      }
    );
    const currentUser = res.data;
    return currentUser?.data;
  } catch (error) {
    throw new Error(error);
  }
};

export const getGroupInfo = async (accessToken = "", group) => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/items/Group/${group}`,
      {
        // headers: {
        //   Authorization: `Bearer ${accessToken}`,
        // },
        withCredentials: true,
      }
    );
    const currentGroup = res.data;
    return currentGroup?.data;
  } catch (error) {
    throw new Error(error);
  }
};

export const updateGeneralInfo = async (accessToken, data) => {
  try {
    const res = await axios.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/users/me`,
      data,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      }
    );
    const currentUser = res.data;
    return currentUser?.data;
  } catch (error) {
    throw new Error(error);
  }
};