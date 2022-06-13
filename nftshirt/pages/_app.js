import '../styles/globals.css'
import '../styles/styles.css'

import Link from 'next/link'

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <nav className="border-b p-6">
        <p className="text-4xl flex justify-center font-bold">Rooloo NFT Marketplace</p>
        <div className="flex mt-4">
          <Link href="/">
            <a className="mr-4 text-pink-500">
              Home
            </a>
          </Link>
          <Link href="/create-item">
            <a className="mr-6 text-pink-500">
              Sell NFT
            </a>
          </Link>
          <Link href="/my-nfts">
            <a className="mr-6 text-pink-500">
              My NFTs
            </a>
          </Link>
          
          <Link href="/seller-dashboard">
            <a className="mr-6 text-pink-500">
              Seller-Dashboard
            </a>
          </Link>

          <Link href="/my-shirtorders">
            <a className="mr-6 text-pink-500">
              Shirt-Orders
            </a>
          </Link>
    
        </div>
      </nav>
      <Component {...pageProps} />
    </div>
  )
}

export default MyApp