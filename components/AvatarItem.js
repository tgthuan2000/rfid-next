import { PhotographIcon } from '@heroicons/react/solid'
import Image from 'next/image'
import { useState } from 'react'
import { client, urlFor } from 'sanity/client'

const AvatarItem = ({ label = 'Label', onChange }) => {
	const [data, setData] = useState(null)

	const handleUploadFile = (e) => {
		const file = e.target.files[0]
		if (file) {
			client.assets
				.upload('image', file)
				.then((data) => {
					onChange?.(data._id)
					setData(data)
				})
				.catch((error) => console.log(error))
		}
	}
	return (
		<div className='sm:col-span-6'>
			<label htmlFor='photo' className='block text-sm font-medium text-gray-700'>
				{label}
			</label>
			<div className='mt-1 flex md:items-end items-center md:flex-row flex-col gap-2'>
				{data ? (
					<Image
						className='rounded-full object-cover'
						src={urlFor(data)}
						alt=' '
						layout='fixed'
						width={80}
						height={80}
					/>
				) : (
					<span className='h-20 w-20 rounded-full overflow-hidden bg-gray-100 p-4'>
						<PhotographIcon className='h-full w-full text-gray-300' />
					</span>
				)}
				<label className='cursor-pointer whitespace-nowrap ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50'>
					Thay đổi
					<input type='file' hidden onChange={handleUploadFile} accept='image/*' />
				</label>
			</div>
		</div>
	)
}

export default AvatarItem
