Hi! Welcome to Project #19 Cyber Secure Smart Homes

This particular folder contains all the implementation that was done for GESHA for our small scale proof of concept.

## Prerequisities

- [IntelliJ IDEA](https://www.jetbrains.com/idea/)
- [Node.js](https://nodejs.org/en/)
- [NPM](https://www.npmjs.com/)
- [Truffle](https://github.com/trufflesuite/truffle)
- [Maven](https://maven.apache.org/)
- [Gradle](https://gradle.org/)

## Running Proof of Concept

To start running the proof of concept, follow these instructions:

Each main step assumes you are in the root of the folder

- Running IEC61850/MMS Server
  - Open the iec61850-server folder in IntelliJ
  - Wait for Gradle to install its dependencies
  - On the file explorer navigate to `src/main/java/com/beanit/iec61850bean/app/ConsoleServer` and right click on the `ConsoleServer.java` file and click on run. You will also need to provide the program arguments of `-m test_model.icd` to succesfully run the Server
  - Similarly on the file explorer navigate to `src/main/java/com/beanit/iec61850bean/app/ClientManager` and right click on the `ClientManager.java` file and click on run. You will not need to provide program arguments
  - Once both are running without any errors, you are ready for the next step
- Running smart-home-backend
  - Open the smart-home-backend folder in IntelliJ
  - Wait for Maven to install its dependencies
  - On the file explorer navigate to `src/main/java/backend/StartWebApp` and right click on the `StartWebApp.java` file and click on run. You will not need to provide program arguments
  - To test that the backend is running, navigate to `http://localhost:8081/data`, if it returns a `json` full of data then the backend is working
  - Once it is running without any errors, you are ready for the next step
- Running Local Ethereum Blockchain Server
  - Navigate to the `ethereum-blockchain-server-client` folder on terminal by the command: `cd ethereum-blockchain-server-client`
  - Run the command `truffle develop` to start up the test server
  - When the server is running, type the command `compile` and then the command `migrate`. This will compile the smart contracts and then migrate them
  - Once it is running without any errors, you are ready for the next step
- Running React Web Application which is connected to the blockchain smart contracts
  - Navigate to the `ethereum-blockchain-server-client` folder on terminal by the command: `cd ethereum-blockchain-server-client`
  - Navigate to the client folder `cd client`
  - Install all the dependencies: `npm install`
  - Start the client: `npm start`
- Start Simulating the Smart Homes
  - Navigate to the `smart-home-simulator` folder on terminal by the command: `cd smart-home-simulator`
  - Install all the dependencies: `npm install`
  - Start the smart home: `node smartHome.js`
  - This should now start getting data from the smart-home-backend and sending that data into the smart-contract and the client should be receiving that data
- Attacks
  - In the same `smart-home-simulator` folder, there is another folder called `attacks`, here you can run each attack script while all the above is running. Each script can be run by going into the attacks folder and running `node scriptName.js` The sniffing attack requires the use of wireshark however so it must be downloaded before traffic can be analysed.