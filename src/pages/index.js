import Image from "next/image";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

const nfts = [
  {
    id: 1,
    name: "NFT 1",
    imageUrl: "/nft1.jpg",
    price: "1 ETH",
  },
  {
    id: 2,
    name: "NFT 2",
    imageUrl: "/nft2.jpg",
    price: "0.5 ETH",
  },
];
export default function Home() {
  return (
    <main>
      <div className="container mx-auto py-12 h-screen">
        <h2 className="text-2xl font-semibold mb-4 text-center text-blue-600">
          Available NFTs for Purchase
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {nfts.map((nft) => (
            <div key={nft.id} className="bg-white shadow-md rounded-lg p-4">
              <Image
                src={nft.imageUrl}
                alt={nft.name}
                width={10}
                height={10}
                className="w-full h-auto rounded-lg"
              />
              <h3 className="text-lg font-semibold mt-2">{nft.name}</h3>
              <p className="text-gray-600 mt-1">Price: {nft.price}</p>
              <button
                className="bg-blue-500 w-full hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
                onClick={() => handleBuyClick(nft.id)} // Add a function to handle the buy button click event
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
