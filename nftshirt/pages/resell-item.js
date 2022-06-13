import { useState } from "react";
import { ethers } from "ethers";
import { useRouter } from "next/router";

import Web3Modal from "web3modal";


import {
    nftaddress, nftmarketaddress
} from '../config'

import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json'



export default function ResellItem (){
    const [formInput, updateFormInput] = useState({price:''})
    
    console.log(formInput.price)
    const router = useRouter()
    const tokenId = router.query.tokenId
    const currentPrice = router.query.price

    async function resellItem(){
        let {price} = formInput
        if(!price) return 
        console.log("price is:",price)

        const web3modal = new Web3Modal()
        const connection = await web3modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()

        let contract = new ethers.Contract(nftaddress,NFT.abi,signer)
        
        price = ethers.utils.parseUnits(price,'ether')
        console.log(price)
        contract = new ethers.Contract(nftmarketaddress,Market.abi,signer)

        let listingPrice = await contract.getListingPrice()
        listingPrice = listingPrice.toString()

        let transaction = await contract.resellToken(nftaddress, tokenId, price, {value:listingPrice})
        await transaction.wait()
        router.push('/')

    }
            
            return (
                <div>
                
                <div className="flex justify-center">
               
                  <div className="w-1/2 flex flex-col pb-12">
                  <h2 style={{marginTop:'3%', marginBottom:'3%'}}>Current Price of the NFT: {currentPrice}</h2>
                  <input type="number" placeholder="Asset Price in Ethers" 
                         className="mt-2 border rounded p-4" 
                         onChange={e=>updateFormInput({
                         ...formInput,price:e.target.value
                  })}/>
                  
                  <button onClick={()=>resellItem()}
                  className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg">
                    Resell NFT Token
                  </button>
                  </div>
                </div>
                </div>
            );
}