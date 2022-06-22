// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CoolingOffNFT is ERC721, ERC721URIStorage, Ownable {
    constructor() ERC721("CoolingOffNFT", "COT") {}

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    uint public paymentPool;
    mapping(uint256 => bytes32) private _tradeHashChain;
    function _createTradeHash(bytes32 previousHash, address to) internal pure returns (bytes32){
        return keccak256(
            abi.encodePacked(
                keccak256(abi.encodePacked(previousHash)),
                keccak256(abi.encodePacked(to))
            )
        );
    }

    mapping(bytes32 => uint) private _tradeHashToTimeLimit;
    mapping(bytes32 => address) private _tradeHashToPreviousOwner;
    mapping(bytes32 => uint) private _tradeHashToPayment;

    mapping(uint256 => uint) public prices;

    event Purchase(
        uint tokenId,
        address from, 
        address to, 
        bytes32 ptradehash,
        uint ptradepayment,
        uint ptradelimit,
        bytes32 tradehash,
        uint tradelimit, 
        uint tradepayment
        );
    
    event Debug(
        bytes32 ptradehash,
        bytes32 tradehash
    );

    function safeMint(address to, string memory uri)
    public
    onlyOwner
    returns (uint256)
    {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _safeMint(to, newItemId);
        _setTokenURI(newItemId, uri);
        bytes32 tradeHash = _createTradeHash(
            keccak256(abi.encodePacked(newItemId)),
            to
            );
        _tradeHashChain[newItemId] = tradeHash;
        return newItemId;
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
    public
    view
    override(ERC721, ERC721URIStorage)
    returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function receivePayment(bytes32 tradeHash) public returns (uint) {
        require(_tradeHashToPayment[tradeHash] >0, 'No Ethereum to Free');
        require(block.timestamp >= _tradeHashToTimeLimit[tradeHash], 'Cooling-Off Term');
        require(_msgSender() == _tradeHashToPreviousOwner[tradeHash], 'invalid trade hash');
        Address.sendValue(payable(msg.sender), _tradeHashToPayment[tradeHash]);
        uint payment = _tradeHashToPayment[tradeHash];
        delete(_tradeHashToPayment[tradeHash]);
        delete(_tradeHashToTimeLimit[tradeHash]);
        delete(_tradeHashToPreviousOwner[tradeHash]);
        return payment;
    }

    function coolingOff(uint256 tokenId, bytes32 previousHash) public returns (uint){
        require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721: transfer caller is not owner nor approved");
        bytes32 tradeHash = _createTradeHash(previousHash, _msgSender());
        emit Debug(_tradeHashChain[tokenId], tradeHash);
        if (tradeHash != _tradeHashChain[tokenId]){
            return 0;
        }
        require(tradeHash == _tradeHashChain[tokenId], "invalid hash chain");
        require(_tradeHashToTimeLimit[tradeHash] >= block.timestamp, "expired cooling-off");
        _tradeHashChain[tokenId] = previousHash;
        ERC721.safeTransferFrom(_msgSender(), _tradeHashToPreviousOwner[tradeHash], tokenId);
        uint payment = _tradeHashToPayment[tradeHash];
        Address.sendValue(payable(msg.sender), payment);
        delete(_tradeHashToTimeLimit[tradeHash]);
        delete(_tradeHashToPreviousOwner[tradeHash]);
        delete(_tradeHashToPayment[tradeHash]);
        return payment;
    }

    function setPrice(uint256 tokenId, uint price) public{
        require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721: transfer caller is not owner nor approved");
        prices[tokenId] = price;
    }

    function purchase(uint256 tokenId) public payable {
        uint purchasePrice = prices[tokenId];
        require(purchasePrice > 0, 'token not purchasable');
        require(_msgSender() != ownerOf(tokenId), 'you aready own this token');
        require(purchasePrice <= msg.value, "Insufficient purchase price.");
        bytes32 currentTradeHash = _tradeHashChain[tokenId];
        bytes32 nextTradeHash = _createTradeHash(currentTradeHash, _msgSender());
        _tradeHashToTimeLimit[nextTradeHash] = block.timestamp + 300;
        _tradeHashToPreviousOwner[nextTradeHash] = ownerOf(tokenId);
        _tradeHashToPayment[nextTradeHash] = purchasePrice;
        _tradeHashChain[tokenId] = nextTradeHash;
        
        emit Purchase(tokenId,ownerOf(tokenId),_msgSender(), currentTradeHash,_tradeHashToPayment[currentTradeHash],_tradeHashToTimeLimit[currentTradeHash],nextTradeHash,purchasePrice,_tradeHashToTimeLimit[nextTradeHash]);
        _approve(_msgSender(), tokenId);
        safeTransferFrom(ownerOf(tokenId), _msgSender(), tokenId);
        delete prices[tokenId];
    }
}

