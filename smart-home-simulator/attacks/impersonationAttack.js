const { getWeb3 } = require("../web3");
const moment = require("moment");
const SmartHomeContract = require("../NewSmartHome.json");
const axios = require("axios");

const getSolarData = async () => {
  const { data } = await axios.get("http://127.0.0.1:8081/data");
  const solarData = data["solarGeneration"];
  const oSolarData = data["oSolarGeneration"];
  const [str, power] = solarData && solarData.split(":");
  return [power.trim(), oSolarData];
};

const sendSolarData = async (contract, accounts) => {
  const [power, oSolarData] = await getSolarData();
  const timeStamp = moment().unix();
  console.log(`Sending Solar Data: ${power} at ${timeStamp}`);
  try {
    await contract.methods
      .addData("Solar Panel", power, timeStamp)
      .send({ from: accounts[0], gas: 1000000 });
  } catch (e) {
    console.log(e);
  }
};

const getSensorData = async () => {
  const { data } = await axios.get("http://127.0.0.1:8081/data");
  const sensorData = data["sensorConsumption"];
  const oSensorConsumption = data["oSensorConsumption"];
  const [str, power] = sensorData && sensorData.split(":");
  return [power.trim(), oSensorConsumption];
};

const sendSensorData = async (contract, accounts) => {
  const [power, oSensorConsumption] = await getSensorData();
  const timeStamp = moment().unix();
  console.log(`Sending Sensor Data: ${power} at ${timeStamp}`);
  try {
    const y = await contract.methods
      .addData("Temperature Sensor", power, timeStamp)
      .send({ from: accounts[0], gas: 1000000 });
    const { blockHash } = y;
    io.emit("FromAPI", {
      blockHash,
      timeStamp,
      encryption: oSensorConsumption,
    });
  } catch (e) {
    console.log(e);
  }
};

const main = async () => {
  const web3 = await getWeb3();
  console.log("Web3 Done");
  const accounts = await web3.eth.getAccounts();
  console.log("Accounts Done");
  const networkId = await web3.eth.net.getId();
  console.log("Network ID Done");
  const deployedNetwork = SmartHomeContract.networks[networkId];
  const contract = new web3.eth.Contract(
    SmartHomeContract.abi,
    deployedNetwork && deployedNetwork.address
  );

  setInterval(async () => {
    sendSolarData(contract, accounts);
  }, 1000);

  // Impersonate same user so fails
  setInterval(async () => {
    sendSolarData(contract, accounts);
  }, 1000);
};

main();
