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
          questions_func{
            count
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

export const getTeacherQuizzes = async (accessToken) => {
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
      query QuizTeacher {
        Quiz(
          filter: { user_created: { id: { _in: "$CURRENT_USER" } } }
          sort: ["-date_created"]
        ) {
          id
          title
          description
          startDate
          endDate
          slug
          questions_func {
            count
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

export const getTeacherGroups = async (accessToken) => {
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
          Group(
            filter: {
              teachers: { directus_users_id: { id: { _in: "$CURRENT_USER" } } }
            }
          ) {
            id
            name
          }
        }
      `
    );
    return res.Group;
  } catch (error) {
    throw new Error(error);
  }
};

export const createSchedule = async (values, accessToken) => {
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
      mutation CreateSchedule(
        $date: Date!
        $groups: [create_Schedule_Group_input]!
        $subject: String!
        $homework: String!
      ) {
        create_Schedule_item(
          data: {
            date: $date
            groups: $groups
            subject: $subject
            homework: $homework
          }
        ) {
          id
          subject
          homework
          date
          groups {
            Group_id {
              id
              name
            }
          }
        }
      }
    `;
    const res = await graphQLClient.request(query, values);
    return res.create_Schedule_item;
  } catch (error) {
    throw new Error(error);
  }
};

export const createQuiz = async (values, accessToken) => {
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
      mutation CreateQuiz(
        $slug: String!
        $title: String!
        $groups: [create_Quiz_Group_input]!
        $questions: [create_Quiz_Question_input]!
        $description: String!
        $startDate: Date!
        $endDate: Date!
      ) {
        create_Quiz_item(
          data: {
            slug: $slug
            title: $title
            description: $description
            groups: $groups
            questions: $questions
            startDate: $startDate
            endDate: $endDate
          }
        ) {
          title
          description
          slug
        }
      }
    `;
    const res = await graphQLClient.request(query, values);
    return res.create_Quiz_item;
  } catch (error) {
    throw new Error(error);
  }
};

export const getQuizById = async (values, accessToken) => {
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
      query QuizByID($id: ID!) {
        Quiz_by_id(id: $id) {
          id
          title
          description
          startDate
          endDate
          slug
          scores(sort: ["-score"], limit: 1) {
            score
            date_created
            user {
              email
              first_name
              last_name
              group {
                name
              }
            }
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
          groups {
            Group_id {
              id
              name
            }
          }
        }
      }
    `;
    const res = await graphQLClient.request(query, values);
    return res.Quiz_by_id;
  } catch (error) {
    throw new Error(error);
  }
};

export const updateQuizById = async (values, accessToken) => {
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
      mutation UpdateQuiz(
        $id: ID!
        $title: String
        $groups: [update_Quiz_Group_input]
        $questions: [update_Quiz_Question_input]
        $description: String
        $startDate: Date
        $endDate: Date
      ) {
        update_Quiz_item(
          id: $id
          data: {
            title: $title
            description: $description
            groups: $groups
            questions: $questions
            startDate: $startDate
            endDate: $endDate
          }
        ) {
          title
          description
          slug
        }
      }
    `;
    const res = await graphQLClient.request(query, values);
    console.log("Update", { res });
    return res.update_Quiz_item;
  } catch (error) {
    throw new Error(error);
  }
};

export const deleteQuestionsByIds = async (values, accessToken) => {
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
      mutation DeleteQuizQuestions($ids: [ID!]!) {
        delete_Question_items(ids: $ids) {
          ids
        }
      }
    `;
    const res = await graphQLClient.request(query, values);
    console.log("Delete", { res });
    return res.delete_Question_items;
  } catch (error) {
    throw new Error(error);
  }
};

export const deleteQuizById = async (values, accessToken) => {
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
      mutation DeleteQuizById($id: ID!) {
        delete_Quiz_item(id: $id) {
          id
        }
      }
    `;
    const res = await graphQLClient.request(query, values);
    return res.delete_Quiz_item;
  } catch (error) {
    throw new Error(error);
  }
};

export const getNews = async (accessToken) => {
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
      query GetNews {
        News(
          filter: { status: { _eq: "published" } }
          sort: ["-date_created"]
        ) {
          id
          title
          body
          date_created
        }
      }
    `;
    const res = await graphQLClient.request(query);
    return res.News;
  } catch (error) {
    throw new Error(error);
  }
};
