import { ArrowCircleLeftIcon } from '@heroicons/react/outline'
import clsx from 'clsx'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { CSVLink } from 'react-csv'
import DatePicker from 'react-datepicker'
import { client, urlFor } from 'sanity/client'
import { rfid } from 'sanity/query'

const headers = ['Sản phẩm', 'Barcode', 'Thời gian cập nhật', 'RFID', 'ID mapping', 'Đợt']

const exportCSV = (data = []) => {
	return data.map((item) => ({
		BARCODE_RFID: item._id,
		UPDATED_AT: new Date(item._updatedAt).toLocaleString(),
		BATCH: item.batch || '-',
		RFID: item.rfid,
		BARCODE: item.code_product.barcode.current,
		PRODUCT: item.code_product.name,
		WAREHOUSE: item.warehouse.name + ' - ' + item.warehouse.address,
	}))
}

const Export = () => {
	const [loading, setLoading] = useState(false)
	const [data, setData] = useState([])
	const [date, setDate] = useState({
		start: null,
		end: null,
	})
	const router = useRouter()
	const handleSearch = () => {
		if (date.start == null || date.end == null) return
		setLoading(true)
		client
			.fetch(rfid.SEARCH_MAPPING, { ...date })
			.then((data) => setData(data))
			.catch((error) => console.log(error))
			.finally(() => setLoading(false))
	}
	return (
		<>
			<Head>
				<title>Dashboard | Export</title>
			</Head>
			<div className='px-4 sm:px-6 lg:px-8'>
				<div className='sm:flex sm:items-center -mx-4 sm:-mx-6 lg:-mx-8'>
					<div className='sm:flex-auto flex justify-between items-center'>
						<div className='flex items-center space-x-2'>
							<ArrowCircleLeftIcon
								className='w-8 h-8 cursor-pointer hover:opacity-50'
								onClick={() => router.back()}
							/>
							<h1 className='text-3xl font-semibold text-gray-900'>Xuất báo cáo</h1>
						</div>
					</div>
				</div>
				<div className='mt-10 -mx-4 relative z-20 flex items-center space-x-4 mb-4'>
					<div className='flex items-center'>
						<span className='mr-3'>Từ:</span>
						<DatePicker
							selected={date.start}
							onChange={(date) => setDate((prev) => ({ ...prev, start: date }))}
							showTimeSelect
							className='rounded-md text-sm'
							placeholderText='dd/mm/yyyy - hh:mm'
							dateFormat='dd-MM-yyyy hh:mm aa'
							maxDate={new Date()}
						/>
					</div>
					<div className='flex items-center'>
						<span className='mr-3'>Đến:</span>
						<DatePicker
							selected={date.end}
							onChange={(date) => setDate((prev) => ({ ...prev, end: date }))}
							showTimeSelect
							className='rounded-md text-sm'
							placeholderText='dd/mm/yyyy - hh:mm'
							dateFormat='dd-MM-yyyy hh:mm aa'
							maxDate={new Date()}
						/>
					</div>
					<div className='flex items-center'>
						<button
							onClick={handleSearch}
							className='min-w-[120px] inline-flex font-semibold items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm text-white shadow-sm hover:bg-indigo-700 sm:w-auto'
						>
							Tìm kiếm
						</button>
					</div>
					<div className='flex items-center'>
						<button
							onClick={() => {
								setDate({ start: null, end: null })
								setData([])
							}}
							className='min-w-[120px] inline-flex font-semibold items-center justify-center rounded-md border border-transparent bg-gray-600 px-4 py-2 text-sm text-white shadow-sm hover:bg-gray-700 sm:w-auto'
						>
							Làm mới
						</button>
					</div>
					{data.length > 0 && (
						<div className='flex items-center'>
							<CSVLink
								className='min-w-[120px] inline-flex font-semibold items-center justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm text-white shadow-sm hover:bg-green-700 sm:w-auto'
								data={exportCSV(data)}
								target='_blank'
								filename={'data-mapping-' + new Date().toLocaleString() + '.csv'}
							>
								Xuất báo cáo
							</CSVLink>
						</div>
					)}
				</div>
				<div className='mt-6 flex flex-col'>
					<div className='-my-2 -mx-4 sm:-mx-6 lg:-mx-8'>
						<div className='inline-block min-w-full py-2 align-middle'>
							<div className='shadow-lg ring-1 ring-black ring-opacity-5'>
								<table
									className='min-w-full border-separate'
									style={{ borderSpacing: 0 }}
								>
									<thead className='bg-gray-50'>
										<tr>
											{headers.map((header, index) => (
												<th
													key={index}
													scope='col'
													className={clsx(
														'sticky top-0 z-10 border-b border-gray-300 bg-gray-50 bg-opacity-75 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter',
														index === 0
															? 'sm:pl-6 lg:pl-8 pl-4 pr-3'
															: index === headers.length - 1
															? 'pl-3 pr-4'
															: 'px-3'
													)}
												>
													{header}
												</th>
											))}
										</tr>
									</thead>
									<tbody className='bg-white'>
										{loading ? (
											<tr>
												<td colSpan={6}>
													<div className='text-center text-lg font-semibold text-gray-500 py-10 bg-white'>
														Đang tải, chờ xíu nghen...
													</div>
												</td>
											</tr>
										) : data.length === 0 ? (
											<tr>
												<td colSpan={6}>
													<div className='text-center text-lg font-semibold text-gray-500 py-10 bg-white'>
														Không có dữ liệu
													</div>
												</td>
											</tr>
										) : (
											data.map((item, index) => (
												<tr key={index}>
													<td
														className={clsx(
															index !== data.length - 1 &&
																'border-b border-gray-200',
															'whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6'
														)}
													>
														<div className='flex items-center space-x-2'>
															<div className='flex-shrink-0'>
																<Image
																	src={urlFor(
																		item.code_product.image
																	)}
																	alt=''
																	layout='fixed'
																	width={60}
																	height={60}
																/>
															</div>
															<div>
																<div className='font-medium text-gray-900 truncate max-w-[20vw]'>
																	{item.code_product.name}
																</div>
																<div className='text-gray-500 text-xs'>
																	{
																		item.code_product
																			.categoryProduct.name
																	}
																</div>
															</div>
														</div>
													</td>

													<td
														className={clsx(
															index !== data.length - 1 &&
																'border-b border-gray-200',
															'whitespace-nowrap px-3 py-4 text-sm text-gray-500 font-semibold'
														)}
													>
														{item.code_product.barcode?.current || '-'}
													</td>
													<td
														className={clsx(
															index !== data.length - 1 &&
																'border-b border-gray-200',
															'whitespace-nowrap px-3 py-4 text-sm text-gray-600'
														)}
													>
														{new Date(item._updatedAt).toLocaleString()}
													</td>
													<td
														className={clsx(
															index !== data.length - 1 &&
																'border-b border-gray-200',
															'whitespace-nowrap px-3 py-4 text-sm text-gray-500 hidden sm:table-cell'
														)}
													>
														{item.rfid || '-'}
													</td>
													<td
														className={clsx(
															index !== data.length - 1 &&
																'border-b border-gray-200',
															'whitespace-nowrap px-3 py-4 text-sm text-gray-500 hidden lg:table-cell'
														)}
													>
														{item._id || '-'}
													</td>
													<td
														className={clsx(
															index !== data.length - 1 &&
																'border-b border-gray-200',
															'whitespace-nowrap px-3 py-4 text-sm text-gray-500 hidden lg:table-cell'
														)}
													>
														{item.batch?.name || '-'}
													</td>
												</tr>
											))
										)}
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default Export
