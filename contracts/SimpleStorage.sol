// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract SimpleStorage {
    struct People {
        uint256 favNumber;
        string name;
    }

    mapping(string => uint256) public nameToFavNum;

    // Is 0 on init
    int256 num1;

    People person = People({favNumber: 10, name: "Clown"});
    People person2 = People(10, "Clown");

    People[] public people;
    uint112[] numList;

    function addPerson(string calldata _name, uint256 _favNum) public {
        People memory newPer = People(_favNum, _name);
        nameToFavNum[_name] = _favNum;
        people.push(newPer);
    }

    function store(int256 _num1) public virtual {
        num1 = _num1;
    }

    function retrieve() public view returns (int256) {
        return num1;
    }

    function pureExample() internal pure returns (int256) {
        return 12;
    }
}
