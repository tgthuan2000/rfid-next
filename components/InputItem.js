import clsx from 'clsx'

const InputItem = ({ label = 'Label', className, type = 'text', ...props }) => {
	return (
		<div className={clsx('sm:col-span-3', className)}>
			<label htmlFor={label} className='block text-sm font-medium text-gray-700'>
				{label}
			</label>
			<input
				id={label}
				type={type}
				autoComplete='off'
				className='mt-1 flex-1 block w-full min-w-0 rounded-md sm:text-sm border-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed'
				{...props}
			/>
		</div>
	)
}

export default InputItem
