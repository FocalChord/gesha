const { getWeb3 } = require("../web3");
const moment = require("moment");
const SmartHomeContract = require("../NewSmartHome.json");
const axios = require("axios");
const ENDPOINT = "http://127.0.0.1:4002";
const socketIo = require("socket.io");

const io = require("socket.io")();
io.on("connection", (client) => {
  console.log("Connected");
});

const getSolarData = async () => {
  const { data } = await axios.get("http://127.0.0.1:8081/data");
  const solarData = data["sensor"];
  const [str, power] = solarData && solarData.split(":");
  return power.trim();
};

const main = async () => {
  const web3 = await getWeb3();
  const accounts = await web3.eth.getAccounts();
  const networkId = await web3.eth.net.getId();
  const deployedNetwork = SmartHomeContract.networks[networkId];
  const contract = new web3.eth.Contract(
    SmartHomeContract.abi,
    deployedNetwork && deployedNetwork.address
  );

  setInterval(async () => {
    const power = await getSolarData();
    const timeStamp = moment().unix();
    console.log(`Sending: ${power} at ${timeStamp}`);
    try {
      const y = await contract.methods
        .addData("houseSensor", power, timeStamp)
        .send({ from: accounts[0], gas: 1000000 });
      const { blockHash } = y;
      io.emit("FromAPI", { blockHash, timeStamp });
    } catch (e) {
      console.log(e);
    }
  }, 5000);

  io.listen(4002);
};

main();
