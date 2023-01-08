import React, { FormEvent, useState } from 'react'
import Header from '../components/Header'
import { useAddress, useContract, MediaRenderer, useNetwork, useNetworkMismatch, useOwnedNFTs, useCreateAuctionListing, useCreateDirectListing } from "@thirdweb-dev/react"
import { useRouter } from 'next/router';
import { ChainId, NFT, NATIVE_TOKENS, NATIVE_TOKEN_ADDRESS } from '@thirdweb-dev/sdk';
import network from '../utils/network';

type Props = {}

function create({ }: Props) {
    const address = useAddress();
    const router = useRouter()
    const { contract } = useContract(
        process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT,
        'marketplace'
    )

    const { contract: collectionContract } = useContract(
        process.env.NEXT_PUBLIC_COLLECTION_CONTRACT,
        'nft-collection'
    )

    const [selectedNft, setSelectedNft] = useState<NFT>()

    const { data: ownedNfts, isLoading: nftLoading } = useOwnedNFTs(collectionContract, address)

    const networkMismatch = useNetworkMismatch()
    const [, switchNetwork] = useNetwork()

    const { mutate: createDirectListing, isLoading: isLoadingDirect, error: errorDirect } = useCreateDirectListing(contract)
    const { mutate: createAuctionListing, isLoading: isLoadingAuction, error: errorAuction } = useCreateAuctionListing(contract)

    const handleCreateListing = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (networkMismatch) {
            switchNetwork && switchNetwork(network);
            return;
        }

        if (!selectedNft) return

        const target = e.target as typeof e.target & {
            elements: { listingType: { value: String }, price: { value: String } };
        }

        const { listingType, price } = target.elements

        if (listingType.value === 'directListing') {
            createDirectListing({
                assetContractAddress: process.env.NEXT_PUBLIC_COLLECTION_CONTRACT!,
                tokenId: selectedNft.metadata.id,
                currencyContractAddress: NATIVE_TOKEN_ADDRESS,
                listingDurationInSeconds: 60 * 60 * 24 * 7,
                quantity: 1,
                buyoutPricePerToken: price.value,
                startTimestamp: new Date(),

            }, {
                onSuccess(data, variables, context) {
                    console.log('SUCCESS:', data, variables, context);
                    router.push("/")
                },
                onError(error, variables, context) {
                    console.log('ERROR:', error, variables, context);
                }
            })
        }

        if (listingType.value === 'auctionListing') {
            createAuctionListing({
                assetContractAddress: process.env.NEXT_PUBLIC_COLLECTION_CONTRACT!,
                tokenId: selectedNft.metadata.id,
                currencyContractAddress: NATIVE_TOKEN_ADDRESS,
                listingDurationInSeconds: 60 * 60 * 24 * 7,
                quantity: 1,
                buyoutPricePerToken: price.value,
                startTimestamp: new Date(),
                reservePricePerToken: 0

            }, {
                onSuccess(data, variables, context) {
                    console.log('SUCCESS:', data, variables, context);
                    router.push("/")
                },
                onError(error, variables, context) {
                    console.log('ERROR:', error, variables, context);
                }
            })
        }


    }

    return (
        <div>
            <Header />
            <main className='max-w-6xl mx-auto p-10 pt-2 '>
                <h1 className='text-4xl font-bold '>List an Item</h1>
                <h2 className='text-xl font-semibold pt-5'>Select an Item you would like to sell</h2>
                <hr className='mb-5' />
                <p>
                    Below you will find the NFT's you own in your wallet
                </p>

                <div className='flex overflow-x-auto space-x-2 py-4 scrollbar'>
                    {
                        nftLoading ? (
                            <p className="text-center animate-pulse text-blue-500 ">Loading NFTS...</p>
                        ) : <>

                            {
                                ownedNfts?.map(nft => (
                                    <div onClick={() => setSelectedNft(nft)} className={`flex flex-col space-y-2 bg-gray-100 min-w-fit rounded-md cursor-pointer border-2 p-4 ${selectedNft && selectedNft.metadata && selectedNft.metadata.id === nft.metadata.id && 'border-blue-600'} `} key={nft.metadata.id}>
                                        <MediaRenderer className='h-48 w-48 rounded-lg' src={nft.metadata.image} />
                                        <p className='text-lg truncate font-bold'>{nft.metadata.name}</p>
                                        <p className='text-xs truncate'>{nft.metadata.description}</p>
                                    </div>
                                ))
                            }

                        </>

                    }
                </div>
                {
                    selectedNft && (
                        <form onSubmit={handleCreateListing}>
                            <div className='flex flex-col rounded-md border p-4 mt-6'>
                                <div className='grid grid-cols-2 gap-5 '>
                                    <label className='border-r font-light' >Direct Listing / Fixed Price</label>
                                    <input type="radio" className='ml-auto h-6 w-6 md:h-10 md:w-10' name="listingType" value="directListing" />

                                    <label className='border-r font-light' >Auction</label>
                                    <input type="radio" className='ml-auto h-6 w-6 md:h-10 md:w-10' name="listingType" value="auctionListing" />

                                    <label className='border-r font-light'>Price</label>
                                    <input type="text" name='price' placeholder='0.5' className='bg-gray-100 p-5 focus:outline-none' />

                                </div>
                                <button className='bg-blue-600 text-white rounded-lg p-4 mt-8 ' type='submit' >Create Listing</button>
                            </div>
                        </form>
                    )
                }

            </main>
        </div>
    )
}

export default create