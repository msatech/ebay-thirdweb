import React, { useState } from 'react'
import { useAddress, useDisconnect, useMetamask } from '@thirdweb-dev/react'
import Link from 'next/link'
import { BellIcon, ShoppingCartIcon, ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'

type Props = {}

function Header({ }: Props) {
    const connectWithMetaMask = useMetamask()
    const disconnect = useDisconnect()
    const address = useAddress()
    const [navs, setNavs] = useState([
        {
            name: "Home",
            link:"/home"
        },
        {
            name: "Electronics",
            link:"/electronics"
        },
        {
            name: "Computer",
            link:"/Computer"
        },
        {
            name: "Video games",
            link:"/vide-games"
        },
        {
            name: "Home & Garden",
            link:"/home-garden"
        },
        {
            name: "Health & Beauty",
            link:"/health-beauty"
        },
        {
            name: "Collectibles & Art",
            link:"/collectibles"
        },
        {
            name: "Books",
            link:"/books"
        },
        {
            name: "Music",
            link:"/music"
        },
        {
            name: "Deals",
            link:"/deals"
        },
        {
            name: "Other",
            link:"/other"
        },
        {
            name: "More",
            link:"/more"
        },
    ])
    return (
        <div className='max-w-6xl mx-auto p-2'>
            <nav className='flex justify-between'>
                <div className='flkex items-center space-x-2 text-sm'>
                    {
                        address ? (
                            <button onClick={disconnect} className='connectWalletBtn'>Hi, {address.slice(0,5) + '...' + address.slice(-4)} </button>
                        ) : (

                            <button onClick={connectWithMetaMask} className='connectWalletBtn'>
                                Connect your wallet
                            </button>
                        )
                    }
                    <p className='headerLink'>Daily Deals</p>
                    <p className='hidden md:inline-flex'>Help & Contact</p>
                </div>
                <div className='flex items-center space-x-4 text-sm'>
                    <p className='headerLink'>Ship to</p>
                    <p className='headerLink'>Sell</p>
                    <p className='headerLink'>watchlist</p>

                    <Link href="/addItem" className='flex items-center space-x-2 hover:link'> Add to inventory <ChevronDownIcon className='h-4' /> </Link>
                    <BellIcon className='h-6 w-6' />
                    <ShoppingCartIcon className='h-6 w-6' />
                </div>
            </nav>
            <hr className='mt-2' />
            <section className='flex items-center space-x-2 py-5'>
                <div className='h-16 w-16 sm:w-28 md:w-44 cursor-pointer flex-shrink-0'>
                    <Link href="/">
                        <Image className='h-full w-full object-contain' alt="logo" src="https://upload.wikimedia.org/wikipedia/commons/1/1b/EBay_logo.svg"  width={100} height={100} />
                    </Link>
                </div>
                <button className='lg:flex items-center space-x-2 w-20 hidden'>
                    <p className='text-gray-600 text-sm'>Shop by Category</p>
                    <ChevronDownIcon className='h-4' />
                </button>
                <div className='flex items-center space-x-2 px-2 md:px-5 py-2 border-gray-500 border-2 flex-1 '>
                    <MagnifyingGlassIcon className='w-5 text-gray-400' />
                    <input className='outline-none flex-1' type="text" placeholder='Serach for ...' />
                </div>
                <button className='bg-blue-600 text-white hidden sm:inline px-5 md:px-10 py-2 border-2 border-blue-600'>search</button>
                <Link href="/create">
                    <button className='border-2 border-blue-600 px-5 md:px-10 py-2 text-blue-600 hover:bg-blue-600/50 hover:text-white '>List Item</button>
                </Link>
            </section>
            <hr />

            <section className='flex space-x-3 md:space-x-6 overflow-x-auto overflow-y-hidden py-2 scrollbar justify-center'>
                {
                    navs?.map(nav => (
                        <p key={nav.name} className='link whitespace-nowrap'>{nav.name}</p>
                    ))
                }
            </section>
        </div>
    )
}

export default Header