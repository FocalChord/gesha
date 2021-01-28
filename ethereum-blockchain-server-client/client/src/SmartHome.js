import React from "react";
import moment from "moment";
import { LineChart, PieChart } from "react-chartkick";
import "chart.js";

const getLineData = (readings) => {
  const obj = {};

  readings.forEach((item) => {
    const [temp, timestamp] = item;
    const date = moment.unix(timestamp).format("hh:mm:ss");

    obj[date] = temp;
  });

  return obj;
};

const SmartHome = ({ readings }) => {
  console.log(readings);
  const data = getLineData(readings);
  return (
    <div className="container">
      <h1> Smart Home Hub</h1>
      <div className="block">
        <b>Owner: </b>
        <span>Nisarag</span>
      </div>
      <LineChart data={data} />
      <h1> Transactions </h1>
      <ul>
        {readings.map((reading, idx) => {
          const [temp, timestamp] = reading;
          const date = moment.unix(timestamp).format("hh:mm:ss a");

          return (
            <li key={idx}>
              Temperature is {temp} at {date}{" "}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default SmartHome;
