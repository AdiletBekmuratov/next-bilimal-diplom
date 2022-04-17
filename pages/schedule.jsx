import Loader from "@/components/Loader";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
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
          title={"Расписание"}
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
                <WeekView
                  displayName="Неделя"
                  startDayHour={8}
                  endDayHour={18}
                />
                <Toolbar />
                <DateNavigator />
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

export default Schedule;
