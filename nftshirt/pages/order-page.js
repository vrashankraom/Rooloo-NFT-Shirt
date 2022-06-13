
import {useRouter} from 'next/router'
import Router from 'next/router'

const orderDetails = () =>{
   
    const router = useRouter()
    const name = router.query.name
    const shippingaddress = router.query.shippingaddress
    const state = router.query.state
    const citywithpincode = router.query.citywithpincode
    const phone = router.query.phone
    const image = router.query.image
    const price = router.query.price
    console.log(price)
    const color = router.query.color
    const datetime = router.query.datetime
    const size = router.query.size


    return (
        <div>
        <h1 className="text-2xl py-2 px-10 mb-4 mt-2">Order Details :)</h1>
        <div className='row' style={{marginLeft:'auto',marginRight:'auto'}}>
        {color=='white' && <div className='column' style={{position: 'relative'}}>
          <img className='imgB1' src='images/whiteshirt.webp' style={{width:'100%'}}/>
          <img className='imgA1' src={image} style={{width:'28%',marginLeft:'37%',marginTop:'22%',border:'1px solid'}}/>
          </div>}

        {color=='black' && <div className='column'>
        <img className='imgB1' src="images/blackshirt.jpg" style={{width:'27%'}}/>
          <img className='imgA1' src={image} style={{width:'27%',marginLeft:'28%',marginTop:'22%',border:'1px solid'}}/>
          </div>}

        {color=='red' && <div className='column'>
         <img className='imgB1' src="images/redshirt.jpg" style={{width:'25%'}}/>
          <img className='imgA1' src={image} style={{width:'27%',marginLeft:'27%',marginTop:'22%',border:'1px solid'}}/>
          </div>}
          
          
          <div className='column' style={{position: 'relative', marginTop:'2%'}}>
          <b><h2 className="text-1xl py-2">Date & Time: {datetime}</h2></b>
          <b><h2 className="text-1xl py-2">Name: {name}</h2></b>
          <b><h2 className="text-1xl py-2">Shirt-Size: {size}</h2></b>
          <b><h2 className="text-1xl py-2">Shipping-Address: {shippingaddress}</h2></b>
          <b><h2 className="text-1xl py-2">State: {state}</h2></b>
          <b><h2 className="text-1xl py-2">City & Pincode: {citywithpincode}</h2></b>
          <b><h2 className="text-1xl py-2">Phone: {phone}</h2></b>
          <b><h2 className="text-1xl py-2">Total Price (Excluding Gas Price): {price} Ethers</h2></b>
          </div>
          </div>
        </div>
    )
}

export default orderDetails;