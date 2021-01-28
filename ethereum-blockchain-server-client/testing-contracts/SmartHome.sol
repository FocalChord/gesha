// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.0;
pragma experimental ABIEncoderV2;

contract SmartHome {
    struct SensorData {
        uint256 temperature;
        uint256 timeStamp;
    }

    struct SolarData {
        string data;
        uint256 timeStamp;
    }

    mapping(uint256 => SensorData) public readings;
    uint256 public tempCount;

    mapping(uint256 => SolarData) public solarReadings;
    uint256 public solarCount;

    constructor() public {
        tempCount = 0;
        solarCount = 0;
    }

    function addTemp(uint256 temp, uint256 timeStamp) public {
        readings[tempCount] = SensorData(temp, timeStamp);

        tempCount++;
    }

    function getTemps() public view returns (SensorData[] memory) {
        SensorData[] memory id = new SensorData[](tempCount);

        for (uint256 i = 0; i < tempCount; i++) {
            SensorData storage data = readings[i];
            id[i] = data;
        }

        return id;
    }

    function addSolarData(string memory data, uint256 timeStamp) public {
        solarReadings[solarCount] = SolarData(data, timeStamp);
        solarCount++;
    }

    function getSolarData() public view returns (SolarData[] memory) {
        SolarData[] memory id = new SolarData[](solarCount);

        for (uint256 i = 0; i < solarCount; i++) {
            SolarData storage data = solarReadings[i];
            id[i] = data;
        }

        return id;
    }
}
