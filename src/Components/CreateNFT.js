import UploadImage from "@/UploadImage";
import React, { useState, useEffect } from "react";
import { Web3Storage } from "web3.storage";
const client = new Web3Storage({ token: process.env.NEXT_PUBLIC_API_KEY });
import { useAccount } from "wagmi";
import { ThreeDots } from "react-loader-spinner";
import { ethers } from "ethers";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
const interact = require("../Utils/Interact");

const CreateNFT = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [tokenUri, setTokenUri] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [signer, setSigner] = useState(null);
  const { address } = useAccount();
  const router = useRouter();

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

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    setImage(selectedImage);
  };

  const mintNFT = async () => {
    setLoading(true);
    try {
      const response = await interact.mintNFT(signer, name, tokenUri);
      if (response) {
        toast.success("NFT Minted!");
        router.push("/mynfts")
      }
      console.log(response);
    } catch (error) {
      toast.error("Error in Minting NFT!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const generateURI = async () => {
    try {
      setLoading(true);
      if (!name || !description || !image) {
        toast.error("Fill all the fields!...");
        return;
      }
      const imageUrl = await UploadImage(image);
      if (imageUrl) {
        const nftMetadata = {
          name: name,
          description: description,
          imageUrl: imageUrl,
        };
        const jsonString = JSON.stringify(nftMetadata);
        const file = new File([jsonString], "nftMetadata.json", {
          type: "application/json",
        });

        const cid = await client.put([file]);
        const uri = `https://dweb.link/ipfs/${cid}`;

        console.log(uri);
        if (uri) {
          toast.success("Token URI Generated!");
        }
        setTokenUri(cid);
        return cid;
      } else {
        console.error("Error uploading image");
        toast.error("Error uploading image");
      }
    } catch (error) {
      console.error("Error generating URI:", error);
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 min-h-screen flex justify-center items-center">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <h1 className="text-2xl font-semibold mb-4 text-center text-blue-600">
            Mint NFT
          </h1>
          <div>
            <form>
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={name}
                  onChange={handleNameChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="description"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={description}
                  onChange={handleDescriptionChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
                  required
                ></textarea>
                <label
                  htmlFor="image"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Image
                </label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  onChange={handleImageChange}
                  accept="image/*"
                  className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>

              {tokenUri && (
                <div>
                  <label
                    htmlFor="tokenUri"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Token URI
                  </label>
                  <input
                    type="text"
                    id="tokenUri"
                    name="tokenUri"
                    value={tokenUri}
                    className="shadow appearance-none border rounded w-full mb-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    readOnly
                  />
                </div>
              )}
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    if (tokenUri) {
                      // Call one function when tokenUri is true
                      mintNFT();
                    } else {
                      // Call another function when tokenUri is false
                      generateURI();
                    }
                  }}
                  className="flex justify-center w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-4" // Added 'relative' class
                  disabled={loading}
                >
                  {loading ? (
                    <ThreeDots height="30" width="30" color="#f3f4f6" />
                  ) : tokenUri ? (
                    "Mint NFT"
                  ) : (
                    "Generate URI"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateNFT;
