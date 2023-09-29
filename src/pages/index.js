import Image from "next/image";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
const inter = Inter({ subsets: ["latin"] });
import { ethers } from "ethers";
const interact = require("../Utils/Interact");

export default function Home() {
  const [nfts, setNfts] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tokenId, setTokenId] = useState(null);
  const [buttonLoad, setButtonLoad] = useState(false);
  const [signer, setSigner] = useState(null);

  useEffect(() => {
    async function setupWeb3() {
      if (typeof window.ethereum !== "undefined") {
        // Connect to MetaMask's Ethereum provider
        const provider = new ethers.providers.Web3Provider(window.ethereum);

        try {
          // Request account access
          await window.ethereum.request({ method: "eth_requestAccounts" });

          // Get the signer (user's Ethereum account)
          const signer = provider.getSigner();

          // Set the provider and signer to your state or wherever needed
          // setProvider(provider);
          setSigner(signer);

          console.log("Web3 initialized successfully.");
        } catch (error) {
          console.error("Error requesting account access:", error);
        }
      } else {
        console.warn("MetaMask not detected");
      }
    }

    setupWeb3();
  }, []);

  useEffect(() => {
    const getListedNFTs = async () => {
      setLoading(true); // Set loading to true before starting the request

      try {
        const listedNFTsResponse = await interact.getListOfNFTsForSale();
        setNfts(listedNFTsResponse);
        console.log(listedNFTsResponse);
      } catch (error) {
        console.error("Error fetching minted NFTs:", error);
      } finally {
        setLoading(false); // Set loading to false after the request, whether it succeeds or fails
      }
    };

    getListedNFTs();
  }, []);

  const handleBuyClick = async (e, token) => {
    e.preventDefault();
    setButtonLoad(true); // Set loading to true before starting the request
    const tokenId = token.tokenId
    console.log(tokenId);
    try {
      const listedNFTsResponse = await interact.purchaseNFT(signer, tokenId);
      console.log(listedNFTsResponse);
    } catch (error) {
      console.error("Error fetching minted NFTs:", error);
    } finally {
      setButtonLoad(false); // Set loading to false after the request, whether it succeeds or fails
    }
  };

  return (
    <main>
      <div className="container mx-auto py-12 h-screen">
        <h2 className="text-2xl font-semibold mb-4 text-center text-blue-600">
          Available NFTs for Purchase
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {loading
            ? "Loading..."
            : nfts?.map((nft) => (
                <div key={nft.id} className="bg-white shadow-md rounded-lg p-4">
                  <Image
                    src={nft.imageUrl}
                    alt={nft.name}
                    width={150}
                    height={150}
                    className="w-full h-auto rounded-lg"
                  />
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold mt-2">{nft.name}</h3>
                    <p className="text-gray-600 mt-1">
                      #{nft.tokenData.tokenId.toString()}
                    </p>
                  </div>

                  <p className="text-gray-600 mt-1">
                    Price:{" "}
                    {ethers.utils.formatEther(nft.tokenData.price.toString())}
                  </p>
                  <button
                    className="bg-blue-500 w-full hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
                    onClick={(e) => handleBuyClick(e, nft.tokenData)} // Add a function to handle the buy button click event
                  >
                    Buy
                  </button>
                </div>
              ))}
        </div>
      </div>
    </main>
  );
}
