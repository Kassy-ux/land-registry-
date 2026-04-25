// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract LandRegistry {
  enum Status { Pending, Approved, Rejected }

  struct Parcel {
    uint256 id;
    string titleNumber;
    string location;
    string ipfsHash;
    address owner;
    Status status;
  }

  uint256 public parcelCount;
  mapping(uint256 => Parcel) public parcels;
  mapping(string => bool) public titleExists;

  address public officer;

  event ParcelSubmitted(uint256 indexed parcelId, address indexed owner, string titleNumber);
  event ParcelApproved(uint256 indexed parcelId, address indexed officer);
  event ParcelRejected(uint256 indexed parcelId, address indexed officer);

  modifier onlyOfficer() {
    require(msg.sender == officer, "Not authorized");
    _;
  }

  constructor() {
    officer = msg.sender;
  }

  function submitParcel(
    string memory _titleNumber,
    string memory _location,
    string memory _ipfsHash
  ) external returns (uint256) {
    require(!titleExists[_titleNumber], "Title already exists");
    parcelCount++;
    parcels[parcelCount] = Parcel(
      parcelCount,
      _titleNumber,
      _location,
      _ipfsHash,
      msg.sender,
      Status.Pending
    );
    titleExists[_titleNumber] = true;
    emit ParcelSubmitted(parcelCount, msg.sender, _titleNumber);
    return parcelCount;
  }

  function approveParcel(uint256 _parcelId) external onlyOfficer {
    require(parcels[_parcelId].id != 0, "Parcel not found");
    require(parcels[_parcelId].status == Status.Pending, "Not pending");
    parcels[_parcelId].status = Status.Approved;
    emit ParcelApproved(_parcelId, msg.sender);
  }

  function rejectParcel(uint256 _parcelId) external onlyOfficer {
    require(parcels[_parcelId].id != 0, "Parcel not found");
    require(parcels[_parcelId].status == Status.Pending, "Not pending");
    parcels[_parcelId].status = Status.Rejected;
    emit ParcelRejected(_parcelId, msg.sender);
  }

  function getParcel(uint256 _parcelId) external view returns (Parcel memory) {
    return parcels[_parcelId];
  }
}
