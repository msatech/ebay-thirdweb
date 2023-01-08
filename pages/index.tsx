import Header from "../components/Header"
import { useContract, useActiveListings, MediaRenderer } from '@thirdweb-dev/react'
import Image from "next/image";
import { ListingType } from "@thirdweb-dev/sdk";
import { BanknotesIcon, ClockIcon } from "@heroicons/react/24/outline";

const Home = () => {
    const { contract } = useContract(process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT, "marketplace")
    
    const { data: listings, isLoading: loadingListings } = useActiveListings(contract);
    console.log(listings, "Listsing");

    return(
        <div>
            <Header />
            <main className="max-w-6xl mx-auto py-2 px-6">
                {
                    loadingListings ? (
                        <p className="text-center animate-pulse text-blue-500 ">Loading Listing...</p>
                    ):
                    (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mx-auto">
                            {
                                listings?.map(listing => (
                                    <div className="flex flex-col card hover:scale-105 transition-all duration-150 ease-out" key={listing.id}>
                                        <div className="flex-1 flex-col pb-2 items-center mx-auto">
                                            <MediaRenderer alt="listing" className="w-44" src={listing.asset.image} />
                                        </div>
                                        <div className="pt-2 space-y-4">
                                            <div>
                                                <h2 className="text-lg truncate">{listing.asset.name}</h2>
                                                <hr />
                                                <p className="truncate text-sm text-gray-600 mt-2">{listing.asset.description}</p>
                                            </div>
                                            <p><span className="font-bold mr-2">{listing.buyoutCurrencyValuePerToken.displayValue}</span>{listing.buyoutCurrencyValuePerToken.symbol}</p>

                                            <div className={`flex space-x-2 items-center  py-1 px-4 rounded-md justify-center text-sm border-gray-200 border ${listing.type === ListingType.Direct ? 'bg-blue-200' : 'bg-purple-200' }`}>
                                                <p>{listing.type === ListingType.Direct ? 'Buy Now': 'Auction' }</p>
                                                {listing.type === ListingType.Direct ? (
                                                    <BanknotesIcon className="h-4" />
                                                ): (
                                                    <ClockIcon className="h-4" />
                                                )
                                            }
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    )
                }
            </main>
        </div>
    )
}

export default Home