const { getWeb3 } = require("../web3");
const moment = require("moment");
const SmartHomeContract = require("../SmartHome.json");

const ENDPOINT = "http://127.0.0.1:4001";
const socketIo = require("socket.io");

const io = require("socket.io")();
io.on("connection", (client) => {
  console.log("Connected");
});

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
    const temperature = Math.floor(20 + Math.random() * 15);
    const timeStamp = moment().unix();
    console.log(`Sending: ${temperature} at ${timeStamp}`);

    try {
      const y = await contract.methods
        .addTemp(temperature, timeStamp)
        .send({ from: accounts[0] });

      const { blockHash } = y;

      io.emit("FromAPI", { blockHash, timeStamp });
    } catch (e) {
      console.log(e);
    }
  }, 5000);

  io.listen(4001);
};

main();
