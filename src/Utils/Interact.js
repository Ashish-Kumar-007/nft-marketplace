import { ethers } from "ethers";
import toast from "react-hot-toast";

const marketContractData = require("../../Contracts/artifacts/Marketplace.json");
const nftContractData = require("../../Contracts/artifacts/NFT.json");

const provider = new ethers.providers.JsonRpcProvider(
  process.env.NEXT_PUBLIC_RPC_URL
);

// const signer = provider.getSigner();

const contract = new ethers.Contract(
  marketContractData.Address,
  marketContractData.ABI,
  provider
);

const nftContract = new ethers.Contract(
  nftContractData.Address,
  nftContractData.ABI,
  provider
);

async function getListOfNFTsForSale() {
  try {
    let tokenIdsList = await contract.getAllListedNFTs();
    console.log(tokenIdsList);
    const tokenURIs = await Promise.all(
      tokenIdsList.map(async (element) => {
        try {
          console.log(element.tokenId.toString());
          const tokenURI = await nftContract.tokenURI(
            element.tokenId.toString()
          );
          const url = makeGatewayURL(tokenURI, "nftMetadata.json");
          const res = await fetch(url);

          if (!res.ok) {
            throw new Error(
              `Error fetching image metadata: [${res.status}] ${res.statusText}`
            );
          }
          const metadata = await res.json();
          console.log({
            ...metadata,
            nftData: element,
          });

          return { ...metadata, tokenData: element };
        } catch (error) {
          // Handle errors, such as if the token does not exist
          console.error(
            `Error getting tokenURI for tokenId ${tokenId}:`,
            error
          );
          return null; // Return null for the failed token
        }
      })
    );

    // Filter out null values (failed tokens)
    const validTokenURIs = tokenURIs.filter((tokenURI) => tokenURI !== null);
    console.log(tokenURIs);
    return validTokenURIs;
  } catch (error) {}
}

async function mintNFT(signer, name, tokenUri) {
  try {
    console.log(signer);
    const gasLimit = 500000; // Set an appropriate gas limit
    const transaction = await contract.connect(signer).mintNFT(name, tokenUri, {
      gasLimit: gasLimit,
    });
    // Wait for the transaction to be mined
    const receipt = await transaction.wait();
    return receipt;
    console.log(receipt);
  } catch (error) {
    console.error("Error in mintNFT:", error);
    // Additional error handling logic can be added here
  }
}

async function listNFT(signer, tokenId, price) {
  try {
    // First, approve the market contract to manage the NFT
    const approveTransaction = await nftContract
      .connect(signer)
      .approve(marketContractData.Address, tokenId);

    // Wait for the approval transaction to be mined
    await approveTransaction.wait();

    // Convert the price to Wei
    const newPriceInWei = ethers.utils.parseEther(price.toString());

    // List the NFT for sale
    const listTransaction = await contract
      .connect(signer)
      .listNFTForSale(tokenId, newPriceInWei);

    // Wait for the listing transaction to be mined
    const receipt = await listTransaction.wait();
    console.log("NFT listed successfully!");
    return receipt;
    // Transaction was successful, handle the result as needed
  } catch (error) {
    console.error("Error in listNFT:", error);
    // Additional error handling logic can be added here
  }
}

async function purchaseNFT(address, signer, tokenId) {
  try {
    console.log(tokenId.toString(), signer);
    const tokenData = await contract.nftListings(tokenId);
    if(tokenData.owner == address){
      return tokenData.owner;
    }
    const price = tokenData.price.toString();
    console.log(tokenData.price.toString());

    const transaction = await contract.connect(signer).purchaseNFT(tokenId, {
      value: price,
    });
    const receipt = await transaction.wait();
    console.log(receipt);
    return receipt;
  } catch (error) {
    console.error(error);
  }
}

async function getOwnedListedNFTs(address) {
  try {
    let tokenIdsList;
    await contract
      .getOwnedListedNFTs(address)
      .then((result) => {
        tokenIdsList = result;
        console.log("Contract data:", result.toString());
      })
      .catch((error) => {
        console.error("Error calling contract function:", error);
      });
    const tokenURIs = await Promise.all(
      tokenIdsList.map(async (tokenId) => {
        try {
          const tokenURI = await nftContract.tokenURI(tokenId);
          const tokenData = await contract.nftListings(tokenId);
          const url = makeGatewayURL(tokenURI, "nftMetadata.json");
          const res = await fetch(url);

          if (!res.ok) {
            throw new Error(
              `Error fetching image metadata: [${res.status}] ${res.statusText}`
            );
          }
          //   console.log(tokenData.price.toString());
          const priceInEther = ethers.utils.formatEther(
            tokenData.price.toString()
          );
          const metadata = await res.json();
          //   console.log(metadata);
          const tokenID = tokenId.toString();
          return { ...metadata, tokenID, price: priceInEther };
        } catch (error) {
          // Handle errors, such as if the token does not exist
          console.error(
            `Error getting tokenURI for tokenId ${tokenId}:`,
            error
          );
          return null; // Return null for the failed token
        }
      })
    );

    // Filter out null values (failed tokens)
    const validTokenURIs = tokenURIs.filter((tokenURI) => tokenURI !== null);

    return validTokenURIs;
  } catch (error) {}
}

async function getNFTsMintedByUser(address) {
  try {
    let tokenIdsList;
    await contract
      .getNFTsMintedByUser(address)
      .then((result) => {
        tokenIdsList = result;
        console.log("Contract data:", result.toString());
      })
      .catch((error) => {
        console.error("Error calling contract function:", error);
      });

    const tokenURIs = await Promise.all(
      tokenIdsList.map(async (tokenId) => {
        try {
          const tokenURI = await nftContract.tokenURI(tokenId);
          const tokenData = await contract.nftListings(tokenId);
          const url = makeGatewayURL(tokenURI, "nftMetadata.json");
          const res = await fetch(url);

          if (!res.ok) {
            throw new Error(
              `Error fetching image metadata: [${res.status}] ${res.statusText}`
            );
          }

          const metadata = await res.json();
          console.log(metadata);
          const tokenID = tokenId.toString();
          return { ...metadata, tokenID, isForSale: tokenData.isForSale };
        } catch (error) {
          // Handle errors, such as if the token does not exist
          console.error(
            `Error getting tokenURI for tokenId ${tokenId}:`,
            error
          );
          return null; // Return null for the failed token
        }
      })
    );

    // Filter out null values (failed tokens)
    const validTokenURIs = tokenURIs.filter((tokenURI) => tokenURI !== null);

    return validTokenURIs;
  } catch (error) {
    console.error("Error in getNFTsMintedByUser:", error);
    throw error; // Rethrow the error to propagate it up the stack
  }
}

async function getNFTsBoughtByUser(address) {
  try {
    let tokenIdsList;
    await contract
      .getNFTsBoughtByUser(address)
      .then((result) => {
        tokenIdsList = result;
        console.log("Contract data:", result.toString());
      })
      .catch((error) => {
        console.error("Error calling contract function:", error);
      });

    const tokenURIs = await Promise.all(
      tokenIdsList.map(async (tokenId) => {
        try {
          const tokenURI = await nftContract.tokenURI(tokenId);
          const tokenData = await contract.nftListings(tokenId);
          const url = makeGatewayURL(tokenURI, "nftMetadata.json");
          const res = await fetch(url);

          if (!res.ok) {
            throw new Error(
              `Error fetching image metadata: [${res.status}] ${res.statusText}`
            );
          }

          const metadata = await res.json();
          console.log(metadata);
          const tokenID = tokenId.toString();
          return { ...metadata, tokenID, isForSale: tokenData.isForSale };
        } catch (error) {
          // Handle errors, such as if the token does not exist
          console.error(
            `Error getting tokenURI for tokenId ${tokenId}:`,
            error
          );
          return null; // Return null for the failed token
        }
      })
    );

    // Filter out null values (failed tokens)
    const validTokenURIs = tokenURIs.filter((tokenURI) => tokenURI !== null);

    return validTokenURIs;
  } catch (error) {
    console.error("Error in getNFTsMintedByUser:", error);
    throw error; // Rethrow the error to propagate it up the stack
  }
}

function makeGatewayURL(cid, path) {
  return `https://${cid}.ipfs.dweb.link/${encodeURIComponent(path)}`;
}

module.exports = {
  getListOfNFTsForSale,
  mintNFT,
  listNFT,
  purchaseNFT,
  getOwnedListedNFTs,
  getNFTsMintedByUser,
  getNFTsBoughtByUser,
};
