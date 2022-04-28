const TextaereaItem = ({ label = 'Label', ...props }) => {
	return (
		<div className='sm:col-span-3'>
			<label htmlFor={label} className='block text-sm font-medium text-gray-700'>
				{label}
			</label>
			<div className='mt-1'>
				<textarea
					id={label}
					rows={14}
					className='shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md'
					defaultValue={''}
					{...props}
				/>
			</div>
		</div>
	)
}

export default TextaereaItem
