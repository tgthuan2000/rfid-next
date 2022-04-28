import { PhotographIcon } from '@heroicons/react/solid'
import Image from 'next/image'
import { urlFor } from '../sanity/client'

const AvatarItem = ({ label = 'Label', data }) => {
	return (
		<div className='sm:col-span-3'>
			<label htmlFor='photo' className='block text-sm font-medium text-gray-700'>
				{label}
			</label>
			<div className='mt-1 flex md:items-end items-center md:flex-row flex-col gap-2'>
				{data ? (
					<Image src={urlFor(data)} alt=' ' layout='fixed' width={320} height={320} />
				) : (
					<span className='h-80 w-h-80 rounded-full overflow-hidden bg-gray-100 p-10'>
						<PhotographIcon className='h-full w-full text-gray-300' />
					</span>
				)}
				<button
					type='button'
					className='ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50'
				>
					Thay đổi
				</button>
			</div>
		</div>
	)
}

export default AvatarItem
