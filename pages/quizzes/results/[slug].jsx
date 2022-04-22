import MainWrapper from "@/components/MainWrapper";
import { useRouter } from "next/router";
import React from "react";

const Results = () => {
  const router = useRouter();
  const { slug } = router.query;
  return <MainWrapper title={"Результаты"}>{slug}</MainWrapper>;
};

export default Results;
