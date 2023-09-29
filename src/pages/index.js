import Image from "next/image";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
const inter = Inter({ subsets: ["latin"] });
import { ethers } from "ethers";
import toast from "react-hot-toast";
import { useAccount } from "wagmi";
const interact = require("../Utils/Interact");
import { ThreeDots } from "react-loader-spinner";

export default function Home() {
  const [nfts, setNfts] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tokenId, setTokenId] = useState(null);
  const [buttonLoad, setButtonLoad] = useState(false);
  const [signer, setSigner] = useState(null);
  const account = useAccount();
  const [nftLoading, setNftLoading] = useState([]); // Initialize an empty array

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
      setLoading(true);

      try {
        const listedNFTsResponse = await interact.getListOfNFTsForSale();
        setNfts(listedNFTsResponse);
        console.log(listedNFTsResponse);
        // Initialize the nftLoading state with 'false' for each NFT
        setNftLoading(new Array(listedNFTsResponse.length).fill(false));
      } catch (error) {
        console.error("Error fetching minted NFTs:", error);
      } finally {
        setLoading(false);
      }
    };

    getListedNFTs();
  }, []);

  const handleBuyClick = async (e, token, index) => {
    e.preventDefault();
    setNftLoading((prevLoading) => {
      // Set 'true' for the specific NFT being purchased, others remain unchanged
      const updatedLoading = [...prevLoading];
      updatedLoading[index] = true;
      return updatedLoading;
    });

    const tokenId = token.tokenId;
    console.log(tokenId);

    try {
      const response = await interact.purchaseNFT(
        account.address,
        signer,
        tokenId
      );
      if (response) {
        toast.success("NFT Purchased Successfully!...");
        return;
      }
      if (response == account.address) {
        toast.error("Can't buy own NFT!");
        return;
      }
      console.log(response);
    } catch (error) {
      console.error("Error fetching minted NFTs:", error);
      toast.error("Error in buying NFT!");
      return;
    } finally {
      setNftLoading((prevLoading) => {
        // Set 'false' for the specific NFT being purchased, others remain unchanged
        const updatedLoading = [...prevLoading];
        updatedLoading[index] = false;
        return updatedLoading;
      });
    }
  };

  return (
    <main>
      <div className="container mx-auto py-12 h-screen">
        <h2 className="text-2xl font-semibold mb-4 text-center text-blue-600">
          Available NFTs for Purchase
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {loading ? (
            "Loading..."
          ) : nfts ? (
            nfts?.map(
              (
                nft,
                index // Added 'index' parameter to map
              ) => (
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
                    className="flex justify-center items-center bg-blue-500 w-full hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
                    onClick={(e) => handleBuyClick(e, nft.tokenData, index)} // Pass 'index' to handleBuyClick
                    disabled={nftLoading[index]} // Use 'nftLoading' for the 'disabled' attribute
                  >
                    {nftLoading[index] ? (
                      <ThreeDots height="30" width="30" color="#f3f4f6" />
                    ) : (
                      "Buy"
                    )}
                  </button>
                </div>
              )
            )
          ) : (
            <>
              <p className="text-gray-600 mt-1">No NFTs available for sale!</p>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
