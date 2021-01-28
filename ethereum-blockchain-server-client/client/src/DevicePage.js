import { Flex, Heading } from "@chakra-ui/core";
import axios from "axios";
import "chart.js";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { LineChart } from "react-chartkick";
import socketIOClient from "socket.io-client";
import { colors as c } from "./colors";
import SmartHomeContract from "./contracts/NewSmartHome.json";
import getWeb3 from "./getWeb3";
import Table from "./Table";
import Title from "./Title";

const ENDPOINT = "http://127.0.0.1:4001";
const transformData = (data) => {
  const mapped = data.map(([id, data, timeStamp]) => ({
    id,
    data,
    timeStamp,
  }));

  return mapped;
};

const DevicePage = () => {
  const [currRow, setCurrRow] = useState("0");
  const [readings, setReadings] = useState([]);
  const [web3, setWeb3] = useState();
  const [accounts, setAccounts] = useState();
  const [contract, setContract] = useState();
  const [currHash, setCurrHash] = useState({ hash: "", timeStamp: "" });
  const [actualReadings, setActualReadings] = useState([]);
  const [gridConn, setGridConn] = useState("");

  const deviceTable = [...new Set(actualReadings.map((reading) => reading.id))]
    .map((name, idx) => ({ id: idx, name }))
    .filter((x) => x.name);
  const graphTable = actualReadings
    .filter((reading) => reading.id === currRow)
    .map((reading) => ({
      ...reading,
      timeStamp: moment.unix(reading.timeStamp).format("hh:mm:ss a"),
    }));

  const lineData = actualReadings
    .filter((reading) => reading.id === currRow)
    .reduce((acc, { data, timeStamp, blockHash }) => {
      if (!blockHash) return acc;
      const date = moment.unix(timeStamp).format("hh:mm:ss");
      acc[date] = data;
      return acc;
    }, {});

  useEffect(() => {
    if (readings.length === 0) return;

    const obj = readings.filter((reading) => {
      const ws = String(currHash.timeStamp);
      const cr = String(reading.timeStamp);
      return ws === cr;
    });

    const [actualObj] = obj;
    const newObj = {
      ...actualObj,
      blockHash: currHash.blockHash,
      encryption: currHash.encryption,
    };

    const filteredReadings = actualReadings.filter((reading) => {
      const ws = String(currHash.timeStamp);
      const cr = String(reading.timeStamp);
      return ws !== cr;
    });

    const acr = [...filteredReadings, newObj];

    console.log(acr);

    setActualReadings(acr);
  }, [readings]);

  useEffect(() => {
    const initSocket = async () => {
      const socket = socketIOClient(ENDPOINT);
      socket.on("FromAPI", (data) => setCurrHash(data));
    };

    const init = async () => {
      try {
        // Get network provider and web3 instance.
        const web3 = await getWeb3();

        // Use web3 to get the user's accounts.
        const accounts = await web3.eth.getAccounts();

        // Get the contract instance.
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = SmartHomeContract.networks[networkId];
        const instance = new web3.eth.Contract(
          SmartHomeContract.abi,
          deployedNetwork && deployedNetwork.address
        );

        setWeb3(web3);
        setAccounts(accounts);
        setContract(instance);
      } catch (error) {
        // Catch any errors for any of the above operations.
        alert(
          `Failed to load web3, accounts, or contract. Check console for details.`
        );
        console.error(error);
      }
    };

    init();
    initSocket();
  }, []);

  useEffect(() => {
    const initGridConn = async () => {
      const { data } = await axios.get("http://127.0.0.1:8081/data");
      const connected = data["gridConn"];
      setGridConn(connected);
    };

    initGridConn();

    const timer = setInterval(() => {
      initGridConn();
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!contract) return;
    if (!accounts) return;
    setInterval(runExample, 3000);
  }, [contract, accounts]);

  const runExample = async () => {
    const response = await contract.methods.getData().call();
    const td = transformData(response);
    setReadings(td);
    if (response.length === 0) {
      setCurrRow([...new Set(td.map((reading) => reading.id))][0]);
    }
  };

  useEffect(() => {
    // console.log(currRow, actualReadings);
  }, [currRow]);

  return (
    <Flex direction="column" minHeight="100vh" bg={c.midnightBlue}>
      <Flex justifyContent="center" alignContent="center" height="10%">
        <Title title={gridConn} />
      </Flex>
      <Flex direction="row" height="80%" mt={8}>
        <Flex width="15%" height="100%" direction="column">
          <Flex align="center" justify="center">
            <Heading textAlign="center" color={c.white}>
              Devices
            </Heading>
          </Flex>
          <Flex p={4}>
            <Table
              columns={[
                {
                  Header: "Device ID",
                  accessor: "id",
                },
                {
                  Header: "Device Name",
                  accessor: "name",
                },
              ]}
              data={deviceTable}
              getRowProps={(row) => ({
                onClick: () => {
                  setCurrRow(row.values.name);
                },
                style: {
                  cursor: "pointer",
                  background: row.values.name === currRow ? c.lightGrey : null,
                  color: row.values.name === currRow ? c.darkBlue : c.white,
                },
              })}
              rowHover={{ bg: c.lightMidnightBlue }}
              currRow={currRow}
            />
          </Flex>
        </Flex>
        <Flex width="85%" height="100%" direction="column">
          <Flex align="center" justify="center" direction="column" width="100%">
            <Heading textAlign="center" color={c.white}>
              Graph
            </Heading>
            <Flex
              width="90%"
              alignContent="center"
              justifyContent="center"
              backgroundColor="white"
              mt={2}
            >
              <LineChart id="chart" data={lineData} />
            </Flex>
          </Flex>
          <Flex
            align="center"
            justify="center"
            mt={2}
            direction="column"
            width="100%"
          >
            <Flex>
              <Heading textAlign="center" color={c.white}>
                Transactions
              </Heading>
            </Flex>
            <Flex p={4} width="92%">
              <Table
                columns={[
                  {
                    Header: "Encrypted Data",
                    accessor: "encryption",
                  },
                  {
                    Header: "Transaction Hash",
                    accessor: "blockHash",
                  },
                  {
                    Header: "Data",
                    accessor: "data",
                  },
                  {
                    Header: "Time",
                    accessor: "timeStamp",
                  },
                ]}
                data={graphTable}
                getRowProps={(row) => ({
                  style: {
                    color: c.white,
                  },
                })}
                currRow={currRow}
              />
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default DevicePage;
