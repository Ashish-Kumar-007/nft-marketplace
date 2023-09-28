import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAccount } from "wagmi";

const Header = () => {
  const { isConnected } = useAccount();
  const router = useRouter();
  
  return (
    <header className="bg-blue-500 p-4">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <div className="text-white text-2xl font-semibold">
            NFT Marketplace
          </div>
        </Link>

        <div className="flex justify-between items-center">
          {/* Navigation Menu */}
          <nav className="flex space-x-4 mx-5">
            <Link href="/">
              <div
                className={`text-white ${
                  router.pathname === "/" ? "border-b-2 border-blue-100" : ""
                }`}
              >
                Marketplace
              </div>
            </Link>

            {isConnected ? (
              <>
                <Link href="/mynfts">
                  <div
                    className={`text-white ${
                      router.pathname === "/mynfts" ? "border-b-2 border-blue-100" : ""
                    }`}
                  >
                    My NFTs
                  </div>
                </Link>
                <Link href="/create">
                  <div
                    className={`text-white ${
                      router.pathname === "/create" ? "border-b-2 border-blue-100" : ""
                    }`}
                  >
                    Create NFT
                  </div>
                </Link>
              </>
            ) : (
              <Link
                href="/create"
                className={`pointer-events-none text-gray-800`}
                aria-disabled="true"
              >
                <div className="text-white">Create NFT</div>
              </Link>
            )}
          </nav>

          {/* Wallet Balance and Connect Wallet */}
          <div className="flex items-center space-x-2">
            <ConnectButton />

            {/* User Profile Dropdown (You can implement this separately) */}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
