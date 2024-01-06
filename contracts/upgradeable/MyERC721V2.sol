// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "./MyERC721V1.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";

contract MyERC721V2 is MyERC721V1, ERC721URIStorageUpgradeable {
    function initializeV2() public reinitializer(2) {
        __ERC721URIStorage_init();
    }

    function mint(
        address to,
        uint256 tokenId,
        string memory _tokenURI
    ) public onlyOwner {
        _safeMint(to, tokenId);
        setTokenURI(tokenId, _tokenURI);
    }

    function _burn(
        uint256 tokenId
    ) internal override(ERC721Upgradeable, ERC721URIStorageUpgradeable) {
        super._burn(tokenId);
    }

    function setTokenURI(
        uint256 tokenId,
        string memory _tokenURI
    ) public onlyOwner {
        _setTokenURI(tokenId, _tokenURI);
    }

    function tokenURI(
        uint256 tokenId
    )
        public
        view
        override(ERC721Upgradeable, ERC721URIStorageUpgradeable)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(
        bytes4 interfaceId
    )
        public
        view
        override(ERC721Upgradeable, ERC721URIStorageUpgradeable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
