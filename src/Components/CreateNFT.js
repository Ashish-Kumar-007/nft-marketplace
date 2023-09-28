import UploadImage from "@/UploadImage";
import React, { useState } from "react";
import { Web3Storage } from "web3.storage";
const client = new Web3Storage({ token: process.env.NEXT_PUBLIC_API_KEY });
import { Cloudinary, Upl } from "@cloudinary/url-gen";

const createNFT = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [tokenURI, setTokenURI] = useState("");
  const [image, setImage] = useState(null);

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

  const MintNFT= (e) => {
    e.preventDefault();
  };

  const generateURI = async () => {
    let imageUrl;
    await UploadImage(image)
      .then((response) => {
        imageUrl = response;
      })
      .catch((error) => {
        console.error(error);
      });

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
      setTokenURI(cid);
      return cid;
    } else {
      console.log("Error...");
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

                {tokenURI && (
                  <div>
                    <label
                      htmlFor="tokenURI"
                      className="block text-gray-700 text-sm font-bold mb-2"
                    >
                      Token URI
                    </label>
                    <input
                      type="text"
                      id="tokenURI"
                      name="tokenURI"
                      value={tokenURI}
                      className="shadow appearance-none border rounded w-full mb-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      readOnly
                    />
                  </div>
                )}
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => generateURI()}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-4"
                  >
                    {tokenURI ? "Mint NFT" : "Generate URI"}
                  </button>
                </div>
              </form>
            </div>

        </div>
      </div>
    </div>
  );
};

export default createNFT;
