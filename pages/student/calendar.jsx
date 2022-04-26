import Loader from "@/components/Loader";
import MainWrapper from "@/components/MainWrapper";
import { ViewState } from "@devexpress/dx-react-scheduler";
import {
  Appointments,
  AppointmentTooltip,
  DateNavigator,
  DayView,
  MonthView,
  Scheduler,
  Toolbar,
  ViewSwitcher,
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
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const res = await graphQLClient.request(
    gql`
      query {
        Schedule(filter: { groups: { Group_id: { id: { _in: ${groupId} } } } }) {
          id
          subject
          homework
          date
        }
      }
    `
  );
  const schedule = res.Schedule.map((sc) => ({
    id: sc.id,
    title: sc.subject + " | " + sc.homework,
    startDate: sc.date,
  }));
  return schedule;
};

const Calendar = ({ schedules }) => {
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
        <title>Календарь</title>
      </Head>
      <MainWrapper title={"Календарь"}>
        {isLoading ? (
          <div className="flex justify-center items-center flex-1 h-full">
            <Loader />
          </div>
        ) : (
          <Paper>
            <Scheduler data={data} locale="ru-RU">
              <ViewState
                defaultCurrentDate={new Date()}
                defaultCurrentViewName="Week"
              />

              <DayView displayName="День" startDayHour={8} endDayHour={18} />
              <WeekView displayName="Неделя" startDayHour={8} endDayHour={18} />

              <Toolbar />
              <DateNavigator />
              <ViewSwitcher />
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

Calendar.auth = {
  role: "STUDENT",
};

export default Calendar;
