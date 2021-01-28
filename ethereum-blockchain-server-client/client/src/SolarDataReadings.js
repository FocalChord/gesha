import React from "react";
import moment from "moment";
import { LineChart } from "react-chartkick";
import "chart.js";

const getLineData = (readings) => {
  return readings.reduce((acc, { power, timestamp, blockHash }) => {
    if (!blockHash) return acc;
    const date = moment.unix(timestamp).format("hh:mm:ss");
    acc[date] = power;
    return acc;
  }, {});
};

const SolarDataReadings = ({ readings }) => {
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
          const { power, timestamp, blockHash } = reading;
          if (!blockHash) return;
          const date = moment.unix(timestamp).format("hh:mm:ss a");

          return (
            <li key={idx}>
              Block Hash: {blockHash}, Power is {power} at {date}{" "}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default SolarDataReadings;
