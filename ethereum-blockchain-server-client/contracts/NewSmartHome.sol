// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.0;
pragma experimental ABIEncoderV2;

contract NewSmartHome {
    struct Data {
        string id;
        string data;
        uint256 timeStamp;
    }

    mapping(uint256 => Data) public readings;
    uint256 public count;

    constructor() public {
        count = 0;
    }

    function addData(
        string memory id,
        string memory data,
        uint256 timeStamp
    ) public {
        readings[count] = Data(id, data, timeStamp);
        count++;
    }

    function getData() public view returns (Data[] memory) {
        Data[] memory id = new Data[](count);
        for (uint256 i = 0; i < count; i++) {
            Data storage data = readings[i];
            id[i] = data;
        }

        return id;
    }
}
