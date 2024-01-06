// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "./MyERC721.sol";

/**
 * @title ERC721CloneFactory
 * @notice Contract for creating clones of ERC721 contracts
 */
contract ERC721CloneFactory is MyERC721 {
    // Event emitted when a clone is created
    event CloneCreated(address indexed implementation, address clone);

    /**
     * @dev Deploys a clone of an ERC721 contract
     * @param implementationContract The address of the implementation contract
     * @param name The name of the ERC721 clone
     * @param symbol The symbol of the ERC721 clone
     * @param owner The owner of the ERC721 clone
     */
    function deployERC721Clone(
        address implementationContract,
        string memory name,
        string memory symbol,
        address owner
    ) external initializer {
        // Clone the implementation contract
        address clone = Clones.clone(implementationContract);

        // Delegatecall the encoded initializer function call on the clone
        (bool initSuccess, ) = clone.delegatecall(
            abi.encodeWithSignature(
                "initialize(string,string,address)",
                name,
                symbol,
                owner
            )
        );
        require(initSuccess, "Initialization failed");

        // Emit the CloneCreated event
        emit CloneCreated(implementationContract, clone);
    }
}
