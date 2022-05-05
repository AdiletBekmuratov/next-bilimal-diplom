import getFormatDate from "@/helpers/getFormatDate";
import React from "react";

const NewsCard = ({ title, body, date_created }) => {
  return (
    <div className="bg-white p-5 rounded shadow grid grid-cols-1 gap-2 w-full">
      <h3>{title}</h3>
      <div>
        {<div className="w-full prose max-w-full" dangerouslySetInnerHTML={{ __html: body }} />}
      </div>
      <p className="text-right">{getFormatDate(date_created)}</p>
    </div>
  );
};

export default NewsCard;
