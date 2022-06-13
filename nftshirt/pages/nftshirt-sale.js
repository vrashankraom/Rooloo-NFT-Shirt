import { useState } from "react";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import Router from 'next/router'
import Web3Modal from "web3modal";

import {
    nftaddress, nftmarketaddress
} from '../config'

import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json'

const BuyNftShirt = () =>{
    //const {handle} = props.match.params
    const router = useRouter()
    //console.log(router.query);
    const image = router.query.image
    const id = router.query.id
    const price = router.query.price
    const color = router.query.color

    const shirtPrice = 0.3;

    const [formInput, updateFormInput] = useState({name:'',shippingaddress:'',
    state:'',citywithpincode:'',phone:'',size:''})

    const time = new Date().toLocaleTimeString();
    console.log(time)

    var dateObj = new Date();
    var month = dateObj.getUTCMonth() + 1; //months from 1-12
    var day = dateObj.getUTCDate();
    var year = dateObj.getUTCFullYear();

    const datetime = day + "/" + month + "/" + year + " " + time;
    console.log(datetime)

    async function buyNftWithShippingDetails(id,price){
        const {name,shippingaddress,state,citywithpincode,phone, size}= formInput
        if (!name || !shippingaddress || !state || !citywithpincode || !phone || !size){
            return 
        }
        const web3modal = new Web3Modal()
        const connection = await web3modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(nftmarketaddress,Market.abi,signer)
       
    
        console.log(price,typeof(price))

        
        const pri = ethers.utils.parseUnits(price,'ether')
       
        price = parseFloat(price)
        console.log(price,typeof(price))
        price = price + shirtPrice
        price = parseFloat((price).toFixed(2))
        console.log(price)

        const Price = price
        price = ethers.utils.parseUnits(price.toString(),'ether')
        console.log(price)

        console.log(pri)

        let totalPrice = await contract.getNFTShirtPrice(pri)
        totalPrice = totalPrice.toString()
        console.log(totalPrice)
        const transaction = await contract.createMarketSaleWithShirt(nftaddress,id,name,
        shippingaddress,state,citywithpincode,phone,image,color,datetime,price,size,{
          value:totalPrice
        })
        console.log(transaction)
        await transaction.wait()
        console.log(name,shippingaddress,state,citywithpincode,phone,id,image,Price,datetime,size)
        clickMe(name,shippingaddress,state,citywithpincode,phone,image,Price,color,datetime,size)
      }

    function clickMe(name,shippingaddress,state,citywithpincode,phone,image,Price,color,datetime,size){
      Router.push({pathname: '/order-page',query: { name: name, shippingaddress: shippingaddress,
      state: state, citywithpincode: citywithpincode, phone: phone, image: image, price: Price, color: color,
      datetime:datetime, size:size}})
    }
    
    return (
        <div>
        
          <h1 className="px-20 py-10 text-3xl">Select Shirt Size...</h1>
          <div className="flex justify-center">
          <div className="w-1/4 flex flex-col pb-12">
        
          <select name="shirtsize" id="shirtsize" 
          className="mt-8 border rounded p-4"
          onChange={e=>updateFormInput({
          ...formInput,size:e.target.value})}>
          <option value="Nil">---Not Selected---</option>
          <option value="XS">XS</option>
          <option value="S">S</option>
          <option value="M">M</option>
          <option value="L">L</option>
          <option value="XL">XL</option>
          <option value="XXL">XXL</option>
          </select>
           </div>
           </div>
          <h1 className="px-20 py-10 text-3xl">Add Shipping details...</h1>
          <div className="flex justify-center">
                  <div className="w-1/2 flex flex-col pb-12">
                  <input placeholder="Name" 
                         className="mt-8 border rounded p-4" 
                         onChange={e=>updateFormInput({
                          ...formInput,name:e.target.value
                  })}/>
                  <textarea
                      placeholder="Shipping Address"
                      className="mt-2 border rounded p-4"
                      onChange={e=>updateFormInput({...formInput, shippingaddress:e.target.value})}
                  />
                  <input placeholder="State" 
                         className="mt-2 border rounded p-4" 
                         onChange={e=>updateFormInput({
                         ...formInput,state:e.target.value
                  })}/>
                  <input placeholder="City & Pincode" 
                         className="mt-2 border rounded p-4" 
                         onChange={e=>updateFormInput({
                         ...formInput,citywithpincode:e.target.value
                  })}/>
                  <input placeholder="Phone Number" 
                         className="mt-2 border rounded p-4" 
                         onChange={e=>updateFormInput({
                         ...formInput,phone:e.target.value
                  })}/>
                 
                  <button onClick={()=>buyNftWithShippingDetails(id,price)}
                  className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg">
                    Buy Digital Asset with Shirt
                  </button>
                  </div>
                </div> 
        </div>
      );
}


export default BuyNftShirt;