// SPDX-License-Identifier: GPL-3.0
pragma solidity >0.7.0;
pragma abicoder v2;


interface IEventManagerDOMEv1 {

    event EventDOMEv1(
        uint256  index,
        uint256  timestamp,

        bytes32  indexed origin,
        bytes32  indexed entityIDHash,
        bytes32  indexed previousEntityHash, //AÑADIDO

        string   eventType,
        string   dataLocation,
        string[] metadata
        //bool     indexed active //ELIMINADO

    );

    function emitNewEvent(
        bytes32  origin,
        bytes32  entityIDHash,
        bytes32  previousEntityHash,

        string   memory eventType,
        string   memory dataLocation,
        string[] memory metadata
    ) external returns (bool);

}
