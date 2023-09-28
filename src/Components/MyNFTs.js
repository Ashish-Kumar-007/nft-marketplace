import Image from "next/image";
import React from "react";

const MyNFTs = () => {
  // You can fetch your minted and listed NFTs data here

  // Example data:
  const mintedNFTs = [
    {
      id: 1,
      name: "NFT 1",
      imageUrl: "/nft1.jpg",
    },
    {
      id: 2,
      name: "NFT 2",
      imageUrl: "/nft2.jpg",
    },
  ];

  const listedNFTs = [
    {
      id: 3,
      name: "NFT 3",
      imageUrl: "/nft3.jpg",
      price: "1 ETH",
    },
    {
      id: 4,
      name: "NFT 4",
      imageUrl: "/nft4.jpg",
      price: "0.5 ETH",
    },
  ];

  return (
    <div className="container mx-auto py-12 h-full">
      <h2 className="text-3xl font-semibold mb-4 text-blue-600">
        My Minted NFTs
      </h2>
      <div className="grid grid-cols-3 gap-4">
  {mintedNFTs.map((nft) => (
    <div key={nft.id} className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg">
      <Image
        src={nft.imageUrl}
        alt={nft.name}
        width={10}
        height={10}
        className="w-full h-auto rounded-lg"
      />
      <h3 className="text-lg font-semibold mt-2">{nft.name}</h3>
      <button
        className="bg-blue-500 w-full hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
        onClick={() => handleBuyClick(nft.id)} // Add a function to handle the buy button click event
      >
        Add to Sale
      </button>
    </div>
  ))}
</div>


      <h2 className="text-3xl font-semibold mb-4 my-8 text-blue-600">
        My Listed NFTs
      </h2>
      <div className="grid grid-cols-3 gap-4">
        {listedNFTs.map((nft) => (
          <div key={nft.id} className="bg-white shadow-md rounded-lg p-4 shadow-md rounded-lg p-4 hover:shadow-lg">
            <Image
              src={nft.imageUrl}
              alt={nft.name}
              width={10}
              height={10}
              className="w-full h-auto rounded-lg"
            />
            <h3 className="text-lg font-semibold mt-2">{nft.name}</h3>
            <p className="text-gray-600 mt-1">Price: {nft.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyNFTs;
