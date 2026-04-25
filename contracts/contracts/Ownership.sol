// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Ownership {
  struct Transfer {
    uint256 parcelId;
    address from;
    address to;
    uint256 timestamp;
    bool confirmed;
  }

  mapping(uint256 => address) public currentOwner;
  mapping(uint256 => Transfer) public pendingTransfer;
  mapping(uint256 => Transfer[]) public transferHistory;

  event TransferInitiated(uint256 indexed parcelId, address indexed from, address indexed to);
  event TransferConfirmed(uint256 indexed parcelId, address indexed from, address indexed to);

  function setInitialOwner(uint256 _parcelId, address _owner) external {
    require(currentOwner[_parcelId] == address(0), "Owner already set");
    currentOwner[_parcelId] = _owner;
  }

  function initiateTransfer(uint256 _parcelId, address _buyer) external {
    require(currentOwner[_parcelId] == msg.sender, "Not the owner");
    require(_buyer != address(0), "Invalid buyer");
    pendingTransfer[_parcelId] = Transfer(
      _parcelId,
      msg.sender,
      _buyer,
      block.timestamp,
      false
    );
    emit TransferInitiated(_parcelId, msg.sender, _buyer);
  }

  function confirmTransfer(uint256 _parcelId) external {
    Transfer storage t = pendingTransfer[_parcelId];
    require(t.to == msg.sender, "Not the buyer");
    require(!t.confirmed, "Already confirmed");
    t.confirmed = true;
    currentOwner[_parcelId] = msg.sender;
    transferHistory[_parcelId].push(t);
    delete pendingTransfer[_parcelId];
    emit TransferConfirmed(_parcelId, t.from, msg.sender);
  }

  function getHistory(uint256 _parcelId) external view returns (Transfer[] memory) {
    return transferHistory[_parcelId];
  }
}
