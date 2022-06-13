/** @type {import('next').NextConfig} */


module.exports = {
  webpack(config, {}) {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      child_process: false,
      net: false,
      crypto: false,
    };
    return config;
  },
  images:{
    domains:['ipfs.infura.io']
  }
};

//  reactStrictMode: true,