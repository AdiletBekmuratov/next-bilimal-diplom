import Loader from "@/components/Loader";
import MainWrapper from "@/components/MainWrapper";
import { ViewState } from "@devexpress/dx-react-scheduler";
import {
  Appointments,
  AppointmentTooltip,
  DateNavigator,
  Scheduler,
  Toolbar,
  WeekView,
} from "@devexpress/dx-react-scheduler-material-ui";
import Paper from "@mui/material/Paper";
import { gql, GraphQLClient } from "graphql-request";
import { getSession, useSession } from "next-auth/react";
import Head from "next/head";
import React from "react";
import { useQuery } from "react-query";

const getSchedules = async (groupId, token) => {
  const graphQLClient = new GraphQLClient(
    `${process.env.NEXT_PUBLIC_API_URL}/graphql`,
    {
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
  );

  const res = await graphQLClient.request(
    gql`
      query {
        Timetable(filter: { groups: { Group_id: { id: { _in: ${groupId} } } } }) {
					id
          subject
          startDate
          endDate
        }
      }
    `
  );
  const schedule = res.Timetable.map((sc) => ({
    id: sc.id,
    title: sc.subject,
    startDate: sc.startDate,
    endDate: sc.endDate,
    rRule: "FREQ=WEEKLY",
  }));
  return schedule;
};

const Schedule = ({ schedules }) => {
  const { data: session, status } = useSession();
  const { data, isLoading, error } = useQuery(
    "schedules",
    () => getSchedules(session?.user?.groupId, session?.user?.accessToken),
    {
      initialData: schedules,
    }
  );

  return (
    <>
      <Head>
        <title>Расписание</title>
      </Head>
      <MainWrapper title={"Расписание"}>
        {isLoading ? (
          <div className="flex justify-center items-center flex-1">
            <Loader />
          </div>
        ) : (
          <Paper>
            <Scheduler data={data} locale="ru-RU">
              <ViewState
                defaultCurrentDate={new Date()}
                defaultCurrentViewName="Week"
              />
              <WeekView displayName="Неделя" startDayHour={8} endDayHour={18} />
              <Toolbar />
              <DateNavigator />
              <Appointments />
              <AppointmentTooltip />
            </Scheduler>
          </Paper>
        )}
      </MainWrapper>
    </>
  );
};

export async function getServerSideProps(ctx) {
  const session = await getSession(ctx);
  const schedules = await getSchedules(
    session?.user?.groupId,
    session?.user?.accessToken
  );
  return { props: { schedules } };
}

Schedule.auth = {
  role: "STUDENT",
};

export default Schedule;
