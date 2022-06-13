
import {ethers} from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from 'web3modal'
import { nftaddress, nftmarketaddress } from '../config'
import Router from 'next/router'
import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json'


const Home=()=> {
  const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  const [imageUrl,setImageUrl] = useState('')
  useEffect(()=>{
    loadNFTs()
  },[])

  
  async function loadNFTs(){
   const provider = new ethers.providers.JsonRpcBatchProvider()
   const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
   const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, provider)
   const data = await marketContract.fetchMarketItems()

   const items = await Promise.all(data.map(async i => {
     const tokenUri = await tokenContract.tokenURI(i.tokenId)
     const meta = await axios.get(tokenUri)
     let price = ethers.utils.formatUnits(i.price.toString(),'ether')
     let item ={
       price,
       tokenId: i.tokenId.toNumber(),
       seller: i.seller,
       owner: i.owner,
       image: meta.data.image,
       name: meta.data.name,
       description: meta.data.description
     }
     return item
   }))
   console.log(items)
   setNfts(items)
   setLoadingState('loaded')
  }

  async function buyNft(nft){
    const web3modal = new Web3Modal()
    const connection = await web3modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(nftmarketaddress,Market.abi,signer)
    console.log(nft.price,typeof(nft.price))
    const price = ethers.utils.parseUnits(nft.price.toString(),'ether')
    console.log(nft.price.toString(),'ether')
    const transaction = await contract.createMarketSale(nftaddress,nft.tokenId, {
      value:price
    })
    await transaction.wait()

    loadNFTs()
  
  }
  
  function clickMe(image,id,price){
    Router.push({pathname: '/nft-shirt',query: { image:image, id:id, price:price}})
  }
  

  if(loadingState=='loaded' && !nfts.length) return (
    <h1 className="px-20 py-10 text-3xl">No items in Marketplace</h1>
  )
  return (
    <div className="flex justify-center">
      <div className="px-4" style={{maxWidth:'1600px'}}>
      
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {
            nfts.map((nft,i) =>(
              <div key={i} className="border shadow mb-4 rounded-xl overflow-hidden">
              
              <img src={nft.image}/>
              <div className="p-4">
                <p style={{ height: '50px' }} className="text-2xl font-semibold">{nft.name}</p>
                <div style={{height:'30px', overflow:'hidden'}}>
                  <p className="text-gray-400">{nft.description}</p>
                </div>
              </div>
              <div className="p-4 bg-black">
              <p className="text-2xl mb-4 font-bold text-white">Price:- {nft.price} Ethers</p>
              <button className="w-full bg-pink-500 text-white font-bold py-2 px-12 rounded" 
              onClick={()=>buyNft(nft)}>Buy NFT</button>
              <div>
              <button onClick={()=>clickMe(nft.image,nft.tokenId,nft.price)} className="w-full bg-pink-500 text-white font-bold py-2 px-12 mt-3 rounded">
              Buy NFT with Shirt</button>

              </div>
              
            
              </div>
              
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default Home