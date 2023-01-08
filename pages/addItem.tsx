import React, { FormEvent, useState } from 'react'
import Header from '../components/Header'
import { useAddress, useContract } from "@thirdweb-dev/react"
import { useRouter } from 'next/router';
import Loader from '../components/Loader';

type Props = {}

function AddItem({ }: Props) {

	const address = useAddress();
	const router = useRouter()
	const [isLoading, setIsLoading] = useState<Boolean>(false)
	const [preview, setPreview] = useState<String>()
	const [image, setImage] = useState<File>()
	const { contract } = useContract(
		process.env.NEXT_PUBLIC_COLLECTION_CONTRACT,
		'nft-collection'
	)
	const mintNft = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		setIsLoading(true)
		if(!contract || !address) return
		if(!image){
			alert("Please select an image")
			return 
		}
		const target = e.target as typeof e.target & {
			name: { value: String };
			description: { value: String };
		}
		const metaData = {
			name: target.name.value,
			description: target.description.value,
			image: image,
		}
		try{
			const transaction =  await contract.mintTo(address, metaData);

			const receipt = transaction.receipt;
			const tokenID = transaction.id;
			const nft = await transaction.data()

			console.log(receipt, tokenID, nft);
			setIsLoading(false)
			router.push('/')
			

		}catch(error){
			console.log(error, ">>>> Error")
			setIsLoading(false)
		}
	}

	return (
		<div>
			<Header />
			{isLoading && <Loader text="Creating NFT's..." />}
			<main className='max-w-6xl mx-auto p-10 border'>
				<h1 className='text-4xl font-bold'>Add Item to the Marketplace</h1>
				<h2 className='text-xl font-semibold pt-5'>Item Details</h2>
				<p className='pb-5'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod est reiciendis architecto maiores, sapiente culpa eius aut, ut sequi repellendus maxime porro vero voluptates voluptas dicta. Perferendis laboriosam neque incidunt.</p>
				<div className='flex flex-col justify-center md:flex-row space-x-2 md:space-x-5 pt-5'>
					<img className='border h-80 2-80 object-contain' src={preview || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZHVjdHxlbnwwfHwwfHw%3D&w=1000&q=80"} alt="product-image" />

					<form onSubmit={mintNft} className='flex-1 flex flex-col p-2 space-y-2'>
						<label className='font-light'  htmlFor="name">Name of Item</label>
						<input className='formField' type="text" placeholder='Name of Item' name='name' id="name" />

						<label className='font-light' htmlFor="description">Description</label>
						<input className='formField' type="text" placeholder='Enter Description...' name='description' id="description" />

						<label className='font-light'>Image of Item</label>
						<input type="file" onChange={e => {
							if(e.target.files?.[0]){
								setPreview(URL.createObjectURL(e.target.files[0]));
								setImage(e.target.files[0])
							}
						}} />

						<button type='submit' className='bg-blue-600 font-semibold text-white rounded-full py-4 px-10 w-56 mx-auto mt-5  md:mt-auto md:ml-auto'> Add / Mint Item</button>


					</form>
				</div>
			</main>
		</div>
	)
}

export default AddItem