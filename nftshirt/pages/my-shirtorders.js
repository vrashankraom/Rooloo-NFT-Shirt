import {ethers} from 'ethers'
import { useEffect,useState } from 'react'
import axios from 'axios'
import Web3Modal from 'web3modal'

import {
  nftaddress,nftmarketaddress
} from '../config'

import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json'

export default function MyShirtOrders(){
  const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  const [RPCerror,setRPCerror] = useState('false')
  useEffect(()=>{
    loadNFTs()
  },[])
  async function loadNFTs(){
    try{
    const web3modal = new Web3Modal()
    const connection = await web3modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
    const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
    

    const data = await marketContract.fetchMyNFTShirtOrders()
    console.log(nftaddress, nftmarketaddress)
 
    const items = await Promise.all(data.map(async i => {
      
      let price = ethers.utils.formatUnits(i.price.toString(),'ether')
      let item ={
        price,
        itemId: i.itemId,
        owner: i.owner,
        image: i.image,
        name: i.buyerName,
        shippingAddress: i.shippingAddress,
        state: i.state,
        citywithpincode: i.cityWithPinCode,
        phone: i.phone,
        color: i.color,
        datetime: i.datetime,
        size: i.size
      }
      return item
    }))
    console.log(items)
    setNfts(items)
    setLoadingState('loaded')
  }catch(e){
    if(e=="Error: User Rejected"){
      setRPCerror('true')
    }
    setLoadingState('loaded')
  }
   }

   if(loadingState=='loaded' && RPCerror=='true') return (
    <h1 className="px-20 py-10 text-3xl">Please Sign in to MetaMask Account!</h1>
  )

   if(loadingState=='loaded' && !nfts.length) return (
    <h1 className="px-20 py-10 text-3xl">No Orders Found :(</h1>
  )
  return (
        <div>
        <h1 className="px-20 py-10 text-3xl">All of your Orders...</h1>

          {
            nfts.map((nft,i) =>(
              <div key={i} style={{marginTop:'1%'}}>
              <b><h2 style={{marginLeft:'11%'}}>Order No.{i+1}</h2></b>
              <div className='row' style={{marginLeft:'auto',marginRight:'auto'}}>
        {nft.color=='white' && <div className='column' style={{position: 'relative'}}>
          <img className='imgB1' src='images/whiteshirt.webp' style={{width:'100%'}}/>
          <img className='imgA1' src={nft.image} style={{width:'28%',marginLeft:'37%',marginTop:'22%',border:'1px solid'}}/>
          </div>}

        {nft.color=='black' && <div className='column'>
        <img className='imgB1' src="images/blackshirt.jpg" style={{width:'27%'}}/>
          <img className='imgA1' src={nft.image} style={{width:'27%',marginLeft:'28%',marginTop:'22%',border:'1px solid'}}/>
          </div>}

        {nft.color=='red' && <div className='column'>
         <img className='imgB1' src="images/redshirt.jpg" style={{width:'25%'}}/>
          <img className='imgA1' src={nft.image} style={{width:'27%',marginLeft:'27%',marginTop:'22%',border:'1px solid'}}/>
          </div>}
          
          
          <div className='column' style={{position: 'relative'}}>
          <b><h2 className="text-1xl py-2">Date & Time: {nft.datetime}</h2></b>
          <b><h2 className="text-1xl py-2">Name: {nft.name}</h2></b>
          <b><h2 className="text-1xl py-2">Shirt-Size:: {nft.size}</h2></b>
          <b><h2 className="text-1xl py-2">Shipping-Address: {nft.shippingAddress}</h2></b>
          <b><h2 className="text-1xl py-2">State: {nft.state}</h2></b>
          <b><h2 className="text-1xl py-2">City & Pincode: {nft.citywithpincode}</h2></b>
          <b><h2 className="text-1xl py-2">Phone: {nft.phone}</h2></b>
          <b><h2 className="text-1xl py-2">Total Price (Excluding Gas Price): {nft.price} Ethers</h2></b>
          </div>
          </div>
        
        </div>
            ))
          }
        </div>
  )
}
