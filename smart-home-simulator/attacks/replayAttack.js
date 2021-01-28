const { getWeb3 } = require("../web3");
const moment = require("moment");
const SmartHomeContract = require("../NewSmartHome.json");
const axios = require("axios");

const delay = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const sendSolarData = async (contract, accounts, data, nonce) => {
  const timeStamp = moment().unix();
  console.log(`Sending Solar Data: ${power} at ${timeStamp}`);
  try {
    await contract.methods
      .addData("Solar Panel", data, timeStamp, nonce)
      .send({ from: accounts[0], gas: 1000000 });
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

  await sendSolarData(contract, accounts, "152525", "1948787338");
  // Wait 2 seconds
  await delay(2000);
  // Sending same request again, essentially "replaying it"
  await sendSolarData(contract, accounts, "152525", "1948787338");
};

main();
