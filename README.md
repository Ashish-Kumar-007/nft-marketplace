# NFT Marketplace DApp

This is a simple decentralized application (DApp) for minting, buying and selling non-fungible tokens (NFTs) on the Polygon Mumbai blockchain. Users can list their NFTs for sale, browse available NFTs, and purchase them using Matic (test-matic).

## Features

- **Mint NFTs:** Users can Mint their NFTs by providing a name, image, and decription.

- **List NFTs:** Users can list their NFTs for sale by specifying a name, image, and price in Ether (ETH).

- **Purchase NFTs:** Users can purchase NFTs listed by other users by clicking the "Buy" button and confirming the transaction in their Ethereum wallet.

- **View List of NFTs Available In Their Account:** Users can view their NFTs in differnt sections of MyNFTs Tab.


## Getting Started

1. Clone the repository:

   ```
   git clone https://github.com/Ashish-Kumar-007/nft-marketplace.git
   ```

2. Install dependencies:

   ```
   cd nft-marketplace
   npm install
   ```

3. Run the DApp locally:

   ```
   npm run dev
   ```

   This will start a development server, and you can access the DApp in your web browser at `http://localhost:3000`.

4. Connect Your Ethereum Wallet:

   - Install and set up a MetaMask wallet extension in your browser.
   - Connect your wallet to the DApp by clicking the "Connect Wallet" button.

5. Use the DApp:

   - Mint your own NFT.
   - List your NFTs for sale.
   - Purchase NFTs from other users.

## Dependencies

- [Next.js](https://nextjs.org/docs): The front-end is built using Next.js, a popular React framework for building web applications.

- [ethers.js](https://docs.ethers.io/v5/): ethers.js is used for interacting with the Ethereum blockchain, including sending transactions and fetching NFT data.

- [MetaMask](https://metamask.io/): MetaMask is a popular Ethereum wallet extension that allows users to connect to the DApp and sign transactions.

## Deploying to Production

To deploy this DApp to a production environment, follow these steps:

1. Configure the Ethereum network and contract addresses in your code.

2. Build the production-ready version of your DApp:

   ```
   npm run build
   ```

3. Deploy the built files to a web hosting service of your choice (e.g., GitHub Pages, Netlify, Vercel).

4. Update the DApp's URL in the MetaMask settings to allow users to connect to the production version.

## License

This project is licensed under the [MIT License](LICENSE).

## Acknowledgments

- This DApp was created as a simple example of an NFT marketplace. Feel free to modify and enhance it to suit your needs.

- Special thanks to the Ethereum and blockchain developer community for providing valuable resources and documentation.

## Feedback and Contributions

Contributions and feedback are welcome! If you encounter any issues or have suggestions for improvements, please open an issue or create a pull request.

Happy coding! 🚀
