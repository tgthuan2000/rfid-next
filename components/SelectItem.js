import { Listbox } from '@headlessui/react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'
import clsx from 'clsx'
import { useState, useEffect } from 'react'

const SelectItem = ({ label = 'Label', data, loading = false, selectedValue }) => {
	const [selected, setSelected] = useState(null)

	useEffect(() => {
		setSelected(
			selectedValue ? data?.find((item) => item._id === selectedValue._id) : data?.[0]
		)
	}, [selectedValue, data])

	return (
		<div className='sm:col-span-3'>
			<Listbox value={selected} onChange={setSelected}>
				<Listbox.Label className='block text-sm font-medium text-gray-700'>
					{label}
				</Listbox.Label>
				<div className='relative mt-1'>
					<Listbox.Button className='bg-white relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'>
						<span className='block truncate'>
							{selected?.name || (loading && 'Đang tải...')}
						</span>
						<span className='absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none'>
							<SelectorIcon className='h-5 w-5 text-gray-400' aria-hidden='true' />
						</span>
					</Listbox.Button>

					{!loading && (
						<Listbox.Options className='absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm'>
							{data?.map((item) => (
								<Listbox.Option
									key={item._id}
									className={({ active }) =>
										clsx(
											active ? 'text-white bg-indigo-600' : 'text-gray-900',
											'cursor-default select-none relative py-2 pl-3 pr-9'
										)
									}
									value={item}
								>
									{({ selected, active }) => (
										<>
											<span
												className={clsx(
													selected ? 'font-semibold' : 'font-normal',
													'block truncate'
												)}
											>
												{item.name}
											</span>

											{selected ? (
												<span
													className={clsx(
														active ? 'text-white' : 'text-indigo-600',
														'absolute inset-y-0 right-0 flex items-center pr-4'
													)}
												>
													<CheckIcon
														className='h-5 w-5'
														aria-hidden='true'
													/>
												</span>
											) : null}
										</>
									)}
								</Listbox.Option>
							))}
						</Listbox.Options>
					)}
				</div>
			</Listbox>
		</div>
	)
}

export default SelectItem