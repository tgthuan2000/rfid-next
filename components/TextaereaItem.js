import { forwardRef } from 'react'

const TextaereaItem = forwardRef(({ label = 'Label', ...props }, ref) => {
	return (
		<div className='sm:col-span-6'>
			<label htmlFor={label} className='block text-sm font-medium text-gray-700'>
				{label}
			</label>
			<div className='mt-1'>
				<textarea
					id={label}
					rows={10}
					className='shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md'
					ref={ref}
					{...props}
				/>
			</div>
		</div>
	)
})

export default TextaereaItem
