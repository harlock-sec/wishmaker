
 // SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract WishmakerIdentity is ERC721 {
    uint256 private nextTokenId = 1;

    struct Profile {
        int16[10] quotients;
        uint64 updatedAt;
    }

    mapping(address => uint256) public identityOf;
    mapping(uint256 => Profile) private profiles;

    event IdentityCreated(address indexed owner, uint256 indexed tokenId);
    event QuotientsUpdated(uint256 indexed tokenId);

    constructor() ERC721("Wishmaker ID", "WISHID") {}

    // Create one identity per wallet.
    function createIdentity() external {
        require(identityOf[msg.sender] == 0, "Identity already exists");

        uint256 tokenId = nextTokenId++;
        identityOf[msg.sender] = tokenId;

        emit IdentityCreated(msg.sender, tokenId);

	_safeMint(msg.sender, tokenId);
    }

    // Update the ten personality quotients.
    function updateQuotients(int16[10] calldata scores) external {
        uint256 tokenId = identityOf[msg.sender];
        require(tokenId != 0, "No identity found");

        profiles[tokenId].quotients = scores;
        profiles[tokenId].updatedAt = uint64(block.timestamp);

        emit QuotientsUpdated(tokenId);
    }

    // Read a user's personality profile.
    function getProfile(address user)
        external
        view
        returns (int16[10] memory, uint64)
    {
        uint256 tokenId = identityOf[user];
        require(tokenId != 0, "No identity found");

        Profile storage profile = profiles[tokenId];
        return (profile.quotients, profile.updatedAt);
    }

    // Check whether a wallet has an identity.
    function hasIdentity(address user) external view returns (bool) {
        return identityOf[user] != 0;
    }

    // Disable transfers and burning.
    function _update(address to, uint256 tokenId, address auth)
        internal
        override
        returns (address)
    {
        address from = _ownerOf(tokenId);

        require(from == address(0), "Wishmaker IDs are nontransferable");

        return super._update(to, tokenId, auth);
    }
}
