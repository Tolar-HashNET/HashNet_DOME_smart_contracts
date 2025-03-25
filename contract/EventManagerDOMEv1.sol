// SPDX-License-Identifier: GPL-3.0
pragma solidity >0.7.0;
pragma abicoder v2;

import "./IEventManagerDOMEv1.sol";
import "node_modules/@openzeppelin/contracts/access/Ownable.sol";

contract EventManagerDOMEv1 is IEventManagerDOMEv1, Ownable {

    uint256 public index;

    function emitNewEvent(
      bytes32  _origin,
      bytes32  _entityIDHash,
      bytes32  _previousEntityHash,
      string   memory _eventType,
      string   memory _dataLocation,
      string[] memory _metadata
    ) external override onlyOwner returns (bool) {

        emit EventDOMEv1(
            index,
            block.timestamp,
            _origin,
            _entityIDHash,
            _previousEntityHash,
            _eventType,
            _dataLocation,
            _metadata
        );

        index++;
        return true;
    }

}
