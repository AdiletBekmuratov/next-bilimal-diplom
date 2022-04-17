import Loader from "@/components/Loader";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
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
import React, { useState } from "react";
import { useQuery } from "react-query";

const currentDate = new Date();

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
  const [navbarOpen, setNavbarOpen] = useState(false);
  const { data, isLoading, error } = useQuery(
    "schedules",
    () => getSchedules(session?.user?.group, session?.user?.accessToken),
    {
      initialData: schedules,
    }
  );

  return (
    <>
      <Sidebar navbarOpen={navbarOpen} setNavbarOpen={setNavbarOpen} />
      <div className="flex flex-col flex-1 ">
        <Navbar
          navbarOpen={navbarOpen}
          setNavbarOpen={setNavbarOpen}
          title={"Календарь"}
        />
        <section className="flex flex-1 p-5 overflow-auto bg-gray-50">
          {isLoading ? (
            <div className="flex justify-center items-center flex-1">
              <Loader />
            </div>
          ) : (
            <Paper>
              <Scheduler data={data} locale="ru-RU">
                <ViewState
                  defaultCurrentDate={currentDate}
                  defaultCurrentViewName="Week"
                />

                <DayView displayName="День" startDayHour={8} endDayHour={18} />
                <WeekView
                  displayName="Неделя"
                  startDayHour={8}
                  endDayHour={18}
                />
                <MonthView displayName="Месяц" />

                <Toolbar />
                <DateNavigator />
                <ViewSwitcher />
                <Appointments />
                <AppointmentTooltip />
              </Scheduler>
            </Paper>
          )}
        </section>
      </div>
    </>
  );
};

export async function getServerSideProps(ctx) {
  const session = await getSession(ctx);
  const schedules = await getSchedules(
    session?.user?.group,
    session?.user?.accessToken
  );
  return { props: { schedules } };
}

export default Calendar;
