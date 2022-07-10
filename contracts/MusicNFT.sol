//SPDX-License-Identifier: MIT
// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./ICreatorSBT.sol";

contract MusicNFT is ERC721Enumerable, ERC721URIStorage {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;
    ICreatorSBT private CreatorSBT;
    address private owner;

    mapping(uint => string) private reasonForRemoval;
    mapping(uint => bool) private removed;

    event MusicMinted(
        uint indexed _tokenId,
        address indexed _owner,
        string uri,
        string title,
        string artist,
        string feature
    );

    event MusicBurnt(uint indexed _tokenId);

    constructor(address CreatorSBTAddress) ERC721("Genrez Music NFT", "zMT") {
        CreatorSBT = ICreatorSBT(CreatorSBTAddress);
        owner = msg.sender;
    }

    // allow only zSBT holders
    modifier onlyzSBTHolder() {
        require(CreatorSBT.balanceOf(msg.sender) == 1, "You need to mint zSBT");
        _;
    }

    function mintMusic(
        string calldata uri,
        string memory _title,
        string memory _artist,
        string memory _feature
    ) external onlyzSBTHolder {
        require(bytes(uri).length > 0, "Invalid uri");
        _tokenIdCounter.increment();

        uint tokenId = _tokenIdCounter.current();

        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, uri);

        emit MusicMinted(tokenId, msg.sender, uri, _title, _artist, _feature);
    }


    /// @dev allows the contract owner to remove explicit or malicious NFTs
    /// @param _reason is the reason why a Music was removed
    function removeMusic(uint tokenId, string memory _reason) external {
        require(bytes(reasonForRemoval[tokenId]).length == 0 && !removed[tokenId], "Already deleted");
        require(owner == msg.sender, "Only contract owner");
        require(bytes(_reason).length > 0, "You have to provide a reason");
        removed[tokenId] = true;
        reasonForRemoval[tokenId] = _reason;
        _burn(tokenId);
    }

    ///@dev specify overrides for multi inheritted functions in ERC721Enumerable, ERC721URIStorage
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint tokenId
    ) internal virtual override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);

        emit MusicBurnt(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
}
