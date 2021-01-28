// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.0;
pragma experimental ABIEncoderV2;

contract MachineToMachine {
    struct Data {
        string data;
        bool on;
    }

    mapping(uint256 => Data) public firstMachineRecordings;
    mapping(uint256 => Data) public secondMachineRecordings;
    uint256 public fmCount;
    uint256 public smCount;

    constructor() public {
        fmCount = 0;
        smCount = 0;
    }

    function compareStrings(string memory a, string memory b)
        public
        view
        returns (bool)
    {
        return (keccak256(abi.encodePacked((a))) ==
            keccak256(abi.encodePacked((b))));
    }

    function lessThan(string memory a, string memory b)
        public
        view
        returns (bool)
    {
        return (keccak256(abi.encodePacked((a))) <
            keccak256(abi.encodePacked((b))));
    }

    function greaterThan(string memory a, string memory b)
        public
        view
        returns (bool)
    {
        return (keccak256(abi.encodePacked((a))) >
            keccak256(abi.encodePacked((b))));
    }

    function addData(string memory machine, string memory data) public {
        if (compareStrings(machine, "fm")) {
            firstMachineRecordings[fmCount] = Data(data, true);
            fmCount++;

            if (lessThan(data, "22")) {
                secondMachineRecordings[smCount] = Data(
                    secondMachineRecordings[smCount - 1].data,
                    false
                );
            }

            if (greaterThan(data, "28")) {
                secondMachineRecordings[smCount] = Data(
                    secondMachineRecordings[smCount - 1].data,
                    true
                );
            }
        } else {
            secondMachineRecordings[smCount] = Data(
                data,
                secondMachineRecordings[smCount - 1].on
            );
            smCount++;
        }
    }
}
