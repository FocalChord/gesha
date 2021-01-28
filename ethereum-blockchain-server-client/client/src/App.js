import React, { useEffect, useState } from "react";
import socketIOClient from "socket.io-client";
import "./App.css";
import SmartHomeContract from "./contracts/SmartHome.json";
import getWeb3 from "./getWeb3";
import SolarDataReadings from "./SolarDataReadings";

const ENDPOINT = "http://127.0.0.1:4001";

const transformSolarData = (data) => {
  const mapped = data.map(([id, data, timestamp]) => ({
    id,
    data,
    timestamp: "",
  }));

  return mapped;
};

const App = () => {
  const [readings, setReadings] = useState([]);
  const [solarReadings, setSolarReadings] = useState([]);
  const [web3, setWeb3] = useState();
  const [accounts, setAccounts] = useState();
  const [contract, setContract] = useState();
  const [currHash, setCurrHash] = useState({ hash: "", timeStamp: "" });
  const [actualSolarReadings, setActualSolarReadings] = useState([]);

  useEffect(() => {
    if (solarReadings.length === 0) return;

    const obj = solarReadings.filter((solarReading) => {
      const ws = String(currHash.timeStamp);
      const cr = String(solarReading.timestamp);
      return ws === cr;
    });

    const [actualObj] = obj;
    const newObj = {
      ...actualObj,
      blockHash: currHash.blockHash,
    };

    const filteredSolarReadings = actualSolarReadings.filter((solarReading) => {
      const ws = String(currHash.timeStamp);
      const cr = String(solarReading.timestamp);
      return ws !== cr;
    });

    setActualSolarReadings([...filteredSolarReadings, newObj]);
  }, [solarReadings]);

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
    if (!contract) return;
    if (!accounts) return;
    setInterval(runExample, 3000);
  }, [contract, accounts]);

  const runExample = async () => {
    // const response = await contract.methods.getTemps().call();
    const response = await contract.methods.getSolarData().call();
    setSolarReadings(transformSolarData(response));
    // setReadings(response);
  };

  if (!web3) {
    return <div>Loading Web3, accounts, and contract...</div>;
  }

  return (
    <div className="App">
      {/* <SmartHome readings={readings} /> */}
      <SolarDataReadings readings={actualSolarReadings} />
    </div>
  );
};

export default App;
