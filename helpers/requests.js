import axios from "axios";
import { gql, GraphQLClient } from "graphql-request";

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

export const addNewScore = async (accessToken, data) => {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/items/QuizScores`,
      data,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      }
    );
    const result = res.data;
    return result?.data;
  } catch (error) {
    throw new Error(error);
  }
};

export const getQuizzes = async (groupId, userId, accessToken) => {
  try {
    const graphQLClient = new GraphQLClient(
      `${process.env.NEXT_PUBLIC_API_URL}/graphql`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const query = gql`
      query {
        Quiz(
          filter: {
            groups: { Group_id: { id: { _eq: ${groupId} } } }
          }
          sort: "-startDate"
        ) {
          id
          title
          description
          startDate
          endDate
          slug
          scores(
            filter: { user: { id: { _eq: "${userId}" } } }
            sort: ["-score"]
          ) {
            score
          }
          questions {
            Question_id {
              id
            }
          }
          groups {
            Group_id {
              id
              name
            }
          }
        }
      }
    `;
    const res = await graphQLClient.request(query);
    return res.Quiz;
  } catch (error) {
    throw new Error(error);
  }
};

export const getQuizBySlug = async (slug, userId, accessToken) => {
  try {
    const graphQLClient = new GraphQLClient(
      `${process.env.NEXT_PUBLIC_API_URL}/graphql`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const res = await graphQLClient.request(
      gql`
        query {
          Quiz(filter: { slug: { _eq: "${slug}" } }) {
            id
            title
            description
            startDate
            endDate
						slug
						scores(
							filter: { user: { id: { _eq: "${userId}" } } }
							sort: ["-date_created"]
						) {
							score
							date_created
						}
            questions {
              Question_id {
                id
                text
                a
                b
                c
                d
                answer
              }
            }
          }
        }
      `
    );
    return res.Quiz[0];
  } catch (error) {
    throw new Error(error);
  }
};
