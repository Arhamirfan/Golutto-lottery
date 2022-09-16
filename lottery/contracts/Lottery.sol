// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract Lottery {
    address public manager;
    address public winner;
    address[] players;

    constructor() {
        manager = msg.sender;
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function enter() public payable {
        require(msg.value > .01 ether);
        players.push(msg.sender);
    }

    function random() private view returns (uint256) {
        return
            uint256(
                keccak256(
                    abi.encodePacked(block.difficulty, block.timestamp, players)
                )
            );
    }

    function pickWinner() public restricted {
        uint256 index = random() % players.length;
        payable(manager).transfer(((address(this).balance) * 10) / 100);
        payable(players[index]).transfer(address(this).balance);
        winner = players[index];
        players = new address[](0);
    }

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    function getPlayers() public view returns (address[] memory) {
        return players;
    }
}
// pragma solidity ^0.4.17;

// contract Lottery {
//     address public manager;
//     address[] public players;

//     function Lottery() public {
//         manager = msg.sender;
//     }

//     function enter() public payable {
//         require(msg.value > .01 ether);
//         players.push(msg.sender);
//     }

//     function random() private view returns (uint) {
//         return uint(keccak256(block.difficulty, now, players));
//     }

//     function pickWinner() public restricted {
//         uint index = random() % players.length;
//         players[index].transfer(this.balance);
//         players = new address[](0);
//     }

//     modifier restricted() {
//         require(msg.sender == manager);
//         _;
//     }

//     function getPlayers() public view returns (address[]) {
//         return players;
//     }
// }
