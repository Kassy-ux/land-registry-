// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./Ownership.sol";
import "./LandRegistry.sol";

contract Verification {
  LandRegistry public registry;
  Ownership public ownership;

  constructor(address _registry, address _ownership) {
    registry = LandRegistry(_registry);
    ownership = Ownership(_ownership);
  }

  function verifyOwner(uint256 _parcelId) external view returns (address) {
    return ownership.currentOwner(_parcelId);
  }

  function getParcelDetails(uint256 _parcelId) external view returns (
    LandRegistry.Parcel memory parcel,
    address owner
  ) {
    parcel = registry.getParcel(_parcelId);
    owner = ownership.currentOwner(_parcelId);
  }

  function getTransferHistory(uint256 _parcelId) external view returns (
    Ownership.Transfer[] memory
  ) {
    return ownership.getHistory(_parcelId);
  }
}
