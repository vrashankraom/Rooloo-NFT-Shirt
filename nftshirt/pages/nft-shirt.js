

import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Router from 'next/router'



const ChooseNftShirt = () =>{
    //const {handle} = props.match.params
    const router = useRouter()
    console.log(router.query);
    const image = router.query.image
    const id = router.query.id
    const price = router.query.price

    const clickMe = (image,id,price,color) =>{
      Router.push({pathname: '/nftshirt-sale',query: { image: image, id: id, price: price,color:color }})
    }
    
    return (
        <div>
          <h1 className="px-20 py-10 text-3xl">Select your prefered Shirt :)</h1>
          <div className='row' style={{marginLeft:'auto',marginRight:'auto'}}>
          
          <div className='column' style={{position: 'relative'}}>
          <button onClick={()=>clickMe(image,id,price,'white')}>
          <img className='imgB1' src='images/whiteshirt.webp' style={{width:'100%'}}/>
          <img className='imgA1' src={router.query.image} style={{width:'28%',marginLeft:'37%',marginTop:'22%',border:'1px solid'}}/>
          </button>
          </div>
          
          
          <div className='column'>
          <button onClick={()=>clickMe(router.query.image,router.query.id,router.query.price,'black')}>
          <img className='imgB1' src="images/blackshirt.jpg" style={{width:'27%'}}/>
          <img className='imgA1' src={router.query.image} style={{width:'27%',marginLeft:'29%',marginTop:'22%',border:'1px solid'}}/>
          </button>
          </div>
          
          
          <div className='column'>
          <button onClick={()=>clickMe(router.query.image,router.query.id,router.query.price,'red')}>
          <img className='imgB1' src="images/redshirt.jpg" style={{width:'25%'}}/>
          <img className='imgA1' src={router.query.image} style={{width:'27%',marginLeft:'28%',marginTop:'22%',border:'1px solid'}}/>
          </button>
          </div>
          </div>
          

        </div>
      );
}


export default ChooseNftShirt;