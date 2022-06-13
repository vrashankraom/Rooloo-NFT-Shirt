// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract NFTMarket is ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _itemIds;
    Counters.Counter private _itemsSold;
    Counters.Counter private _NFTShirtsSold;


    uint256 listingPrice = 0.025 ether;
    uint256 shirtPrice = 0.3 ether;
    address payable owner;

    constructor(){
        owner = payable(msg.sender);
    }


    struct MarketItem {
      address nftContract;
      uint256 tokenId;
      address payable seller;
      address payable owner;
      uint256 price;
      bool sold;
    }
    
    mapping(uint256 => MarketItem) private idToMarketItem;

    event MarketItemCreated (
      address indexed nftContract,
      uint256 indexed tokenId,
      address seller,
      address owner,
      uint256 price,
      bool sold
    );
    

     struct shippingDetails {
      uint ShirtId;
      string buyerName;
      string shippingAddress;
      string state;
      string cityWithPinCode;
      string phone;
      string image;
      uint256 price;
      string color;
      string datetime;
      string size;
      address owner;
     }

    mapping(uint256 => shippingDetails) private idToShippingDetails;


    function getListingPrice() public view returns (uint256) {
      return listingPrice;
    }

    function getNFTShirtPrice(uint256 NFTprice) public view returns (uint256) {
        return shirtPrice+NFTprice;
    }

    function createMarketItem(
      address nftContract,
      uint256 tokenId,
      uint256 price
    ) public payable nonReentrant {
      require(price > 0, "Price must be at least 1 ether");
      require(msg.value == listingPrice, "Price must be equal to listing price");
       
      _itemIds.increment();
      uint256 tokenId = _itemIds.current();

       idToMarketItem[tokenId] =  MarketItem(
        nftContract,
        tokenId,
        payable(msg.sender),
        payable(address(this)),
        price,
        false
      );

      IERC721(nftContract).transferFrom(msg.sender,address(this),tokenId);

      emit MarketItemCreated(
          nftContract,
          tokenId,
          msg.sender,
          address(this),
          price,
          false
      );
      
    } 

    function createMarketSale(
        address nftContract,
        uint256 tokenId
    ) public payable nonReentrant {
        uint price = idToMarketItem[tokenId].price;
        uint tokenId = idToMarketItem[tokenId].tokenId;

        require(msg.value == price, "Please submit the asking price in order to complete the purchase");

        idToMarketItem[tokenId].seller.transfer(msg.value);
        IERC721(nftContract).transferFrom(address(this),msg.sender, tokenId);
        idToMarketItem[tokenId].owner = payable(msg.sender);
        idToMarketItem[tokenId].sold = true;
        _itemsSold.increment();
        payable(owner).transfer(listingPrice);

    }

    function createMarketSaleWithShirt(
        address nftContract,
        uint256 tokenId,
        string memory buyerName,
        string memory shippingAddress,
        string memory state,
        string memory cityWithPinCode,
        string memory phone,
        string memory image,
        string memory color,
        string memory datetime,
        uint256 price,
        string memory size
    ) public payable nonReentrant {
        
        uint tokenId = idToMarketItem[tokenId].tokenId;
       
        //require(msg.value == (price+shirtPrice), "Please submit the asking price in order to complete the purchase");

        idToMarketItem[tokenId].seller.transfer(msg.value);
        IERC721(nftContract).transferFrom(address(this),msg.sender, tokenId);
        idToMarketItem[tokenId].owner = payable(msg.sender);
        idToMarketItem[tokenId].sold = true;
         _NFTShirtsSold.increment();
        uint256 ShirtId = _NFTShirtsSold.current();
        
        idToShippingDetails[ShirtId] = shippingDetails(
         ShirtId,
         buyerName,
         shippingAddress,
         state,
         cityWithPinCode,
         phone,
         image,
         price,
         color,
         datetime,
         size,
         payable(msg.sender)
        );
        
        _itemsSold.increment();
        payable(owner).transfer(listingPrice);

    }
    
    function fetchMarketItems() public view returns (MarketItem[] memory){
        uint itemCount = _itemIds.current();
        uint unsoldItemCount = _itemIds.current() - _itemsSold.current();
        uint currentIndex = 0;

        MarketItem[] memory items = new MarketItem[](unsoldItemCount);
        for (uint i = 0; i<itemCount; i++){
            if(idToMarketItem[i+1].owner == address(this)){
                uint currentId = idToMarketItem[i+1].tokenId;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex]=currentItem;
                currentIndex+=1;
            }
        }
        return items;
    }

    function fetchMyNFTs() public view returns (MarketItem[] memory){
        uint totalItemCount = _itemIds.current();
        uint itemCount =0;
        uint currentIndex =0;

        for(uint i=0; i<totalItemCount;i++){
            if(idToMarketItem[i+1].owner == msg.sender){
                itemCount+=1;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);
            for (uint i =0;i<totalItemCount;i++){
                if(idToMarketItem[i+1].owner == msg.sender){
                    uint currentId = idToMarketItem[i+1].tokenId;
                    MarketItem storage currentItem = idToMarketItem[currentId];
                    items[currentIndex] = currentItem;
                    currentIndex+=1;
                }
            }
        return items;
    }

    function fetchMyNFTShirtOrders() public view returns (shippingDetails[] memory){
        uint totalNFTShirtsSold = _NFTShirtsSold.current();
        uint itemCount =0;
        uint currentIndex =0;

        for(uint i=0; i<totalNFTShirtsSold;i++){
            if(idToShippingDetails[i+1].owner == msg.sender){
                itemCount+=1;
            }
        }

        shippingDetails[] memory items = new shippingDetails[](itemCount);
            for (uint i =0;i<totalNFTShirtsSold;i++){
                if(idToShippingDetails[i+1].owner == msg.sender){
                    uint currentId = idToShippingDetails[i+1].ShirtId;
                    shippingDetails storage currentItem = idToShippingDetails[currentId];
                    items[currentIndex] = currentItem;
                    currentIndex+=1;
                }
            }
        return items;
    }




    function fetchItemsCreated() public view returns (MarketItem[] memory){
        uint totalItemCount = _itemIds.current();
        uint itemCount =0;
        uint currentIndex=0;

        for(uint i=0;i<totalItemCount;i++){
            if(idToMarketItem[i+1].seller == msg.sender){
                itemCount+=1;
            }
        }
    MarketItem[] memory items = new MarketItem[] (itemCount);
    for (uint i=0;i<totalItemCount;i++){
        if(idToMarketItem[i+1].seller == msg.sender){
        uint currentId = idToMarketItem[i+1].tokenId;
        MarketItem storage currentItem = idToMarketItem[currentId];
        items[currentIndex]=currentItem;
        currentIndex+=1;
        }
    }
    return items;
    }

    function resellToken(address nftContract,uint256 tokenId, uint256 price) public payable {
      //require(idToMarketItem[tokenId].owner == msg.sender, "Only item owner can perform this operation");
      require(msg.value == listingPrice, "Price must be equal to listing price");
      idToMarketItem[tokenId].sold = false;
      idToMarketItem[tokenId].price = price;
      idToMarketItem[tokenId].seller = payable(msg.sender);
      idToMarketItem[tokenId].owner = payable(address(this));
      _itemsSold.decrement();
      IERC721(nftContract).transferFrom(msg.sender,address(this),tokenId);
    }

}