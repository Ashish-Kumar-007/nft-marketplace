import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
const interact = require("../Utils/Interact");

const MyNFTs = () => {
  // You can fetch your minted and listed NFTs data here
  const { address } = useAccount();
  const [mintedNFTs, setMintedNFTs] = useState(null);
  const [listedNFTs, setListedNFTs] = useState(null);
  const [boughtNFTs, setBoughtNFTs] = useState(null)
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedTokenID, setSelectedTokenID] = useState(null);
  const [price, setPrice] = useState(0);
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

  const handleOpenModal = (tokenID) => {
    setOpenModal(!openModal);
    setSelectedTokenID(tokenID);
  };

  useEffect(() => {
    const getMintedNFTs = async () => {
      setLoading(true); // Set loading to true before starting the request

      try {
        const mintedNFTsResponse = await interact.getNFTsMintedByUser(address);
        const listedNFTsResponse = await interact.getOwnedListedNFTs(address);
        const boughtFTsResponse = await interact.getNFTsBoughtByUser(address);
        setMintedNFTs(mintedNFTsResponse);
        setListedNFTs(listedNFTsResponse);
        setBoughtNFTs(boughtFTsResponse)
        console.log(mintedNFTsResponse, listedNFTsResponse);
      } catch (error) {
        console.error("Error fetching minted NFTs:", error);
      } finally {
        setLoading(false); // Set loading to false after the request, whether it succeeds or fails
      }
    };

    getMintedNFTs();
  }, []); // The empty dependency array ensures this effect runs only once

  const listForSale = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true before starting the request

    try {
      const response = await interact.listNFT(signer, selectedTokenID, price);
      console.log(response);
      setListedNFTs(response);
    } catch (error) {
      console.error("Error fetching price:", error);
    } finally {
      setLoading(false); // Set loading to false after the request, whether it succeeds or fails
    }
  };

  return (
    <div
      className={
        loading ? "container mx-auto py-12 h-screen" : "container mx-auto py-12 h-screen"
      }
    >
      <h2 className="text-3xl font-semibold mb-4 text-blue-600">NFTs Minted</h2>
      <div className="grid grid-cols-3 gap-4">
        {loading ? (
          "Loading..."
        ) : mintedNFTs && mintedNFTs.length > 0 ? (
          mintedNFTs?.map((nft) => (
            <div
              key={nft.id}
              className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg"
            >
              {/* The Image component is used here, make sure it's correctly imported */}
              <Image
                src={nft.imageUrl}
                alt={nft.name}
                width={150}
                height={150}
                className="w-full h-auto rounded-lg"
              />
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold mt-2">{nft.name}</h3>
                <div>#{nft.tokenID} </div>
              </div>

              <button
                className="bg-blue-500 w-full hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
                onClick={() => handleOpenModal(nft.tokenID)}
                disabled={nft.isForSale}
              >
                {nft.isForSale ? "Already Listed For Sale" : "Add to Sale"}
              </button>

              {/* Modal */}
              {openModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                  <div className="modal-overlay absolute inset-0 bg-gray-500 opacity-75"></div>
                  <div className="modal-container bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto">
                    {/* Modal content goes here */}
                    <div className="modal-content py-4 text-left px-6">
                      <div className="modal-header text-xl font-semibold border-b-2 border-gray-200">
                        Add to Sale
                      </div>
                      <div className="modal-body mt-4">
                        {/* Modal input fields */}
                        <label>Token ID</label>
                        <input
                          className="border rounded w-full py-2 px-3 mb-3"
                          type="text"
                          disabled
                          value={selectedTokenID}
                        />
                        <label>Price</label>
                        <input
                          className="border rounded w-full py-2 px-3"
                          type="text"
                          placeholder="Input 2"
                          onChange={(e) => {
                            setPrice(e.target.value);
                          }}
                        />
                      </div>
                      <div className="modal-footer w-full mt-4">
                        <button
                          onClick={(e) => {
                            e.preventDefault(); // Prevent form submission
                            listForSale(e);
                          }}
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                        >
                          Add to Sale
                        </button>
                        <button
                          onClick={() => handleOpenModal()} // Close the modal for this NFT
                          className="bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No minted NFTs found.</p>
        )}
      </div>

      <h2 className="text-3xl font-semibold mb-4 my-8 text-blue-600">
        NFTs Listed
      </h2>
      <div className="grid grid-cols-3 gap-4">
        {loading ? (
          <p>Loading...</p>
        ) : listedNFTs && listedNFTs.length > 0 ? (
          listedNFTs.map((nft) => (
            <div
              key={nft.id}
              className="bg-white shadow-md rounded-lg p-4 shadow-md rounded-lg p-4 hover:shadow-lg"
            >
              <Image
                src={nft.imageUrl}
                alt={nft.name}
                width={150}
                height={150}
                className="w-full h-auto rounded-lg"
              />
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold mt-2">{nft.name}</h3>
                <div>#{nft.tokenID} </div>
              </div>
              <p className="text-gray-600 mt-1">
                Description: {nft.description}
              </p>
              <p className="text-gray-600 mt-1">Price: {nft.price}</p>
            </div>
          ))
        ) : (
          <p>No NFTs listed.</p>
        )}
      </div>

      <h2 className="text-3xl font-semibold mb-4 my-8 text-blue-600">
        NFTs Bought
      </h2>
      <div className="grid grid-cols-3 gap-4">
        {loading ? (
          <p>Loading...</p>
        ) : boughtNFTs && boughtNFTs.length > 0 ? (
          boughtNFTs.map((nft) => (
            <div
              key={nft.id}
              className="bg-white shadow-md rounded-lg p-4 shadow-md rounded-lg p-4 hover:shadow-lg"
            >
              <Image
                src={nft.imageUrl}
                alt={nft.name}
                width={150}
                height={150}
                className="w-full h-auto rounded-lg"
              />
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold mt-2">{nft.name}</h3>
                <div>#{nft.tokenID} </div>
              </div>
              <p className="text-gray-600 mt-1">
                Description: {nft.description}
              </p>
            </div>
          ))
        ) : (
          <p>No NFTs Bought.</p>
        )}
      </div>
    </div>
  );
};

export default MyNFTs;
