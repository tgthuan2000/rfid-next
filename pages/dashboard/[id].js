import Head from 'next/head'
import { client, urlFor } from 'sanity/client'
import Image from 'next/image'
import { useQuery } from 'hooks/useQuery'
import { rfid } from 'sanity/query'
import clsx from 'clsx'
import { CSVLink } from 'react-csv'
import { ArrowCircleLeftIcon } from '@heroicons/react/solid'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'

const headers = ['Sản phẩm', 'Barcode', 'RFID', 'ID mapping']

const exportCSV = (data = []) => {
	return data.map((item) => ({
		BATCH: item.batch.name,
		BARCODE_RFID: item._id,
		RFID: item.rfid,
		BARCODE: item.code_product.barcode.current,
		PRODUCT: item.code_product.name,
		WAREHOUSE: item.warehouse.name + ' - ' + item.warehouse.address,
	}))
}

const Detail = () => {
	const router = useRouter()
	const { id } = router.query
	const { data: productData, loading, isError } = useQuery(rfid.GET_LIST, { batchId: id })

	if (isError) return <div>Params Invalid</div>

	return (
		<>
			<Head>
				<title>Dashboard | Detail mapping</title>
			</Head>
			<div>
				<div className='px-4 sm:px-6 lg:px-8'>
					<div className='sm:flex sm:items-center -mx-4 sm:-mx-6 lg:-mx-8'>
						<div className='sm:flex-auto flex space-x-2 items-center'>
							<ArrowCircleLeftIcon
								className='w-8 h-8 cursor-pointer hover:opacity-50'
								onClick={() => router.back()}
							/>
							<h1 className='text-3xl font-semibold text-gray-900'>
								Chi tiết mapping | {productData[0]?.batch.name}
							</h1>
						</div>
						<div className='mt-4 sm:mt-0 sm:ml-16 sm:flex-none'>
							<CSVLink
								className='min-w-[120px] inline-flex font-semibold items-center justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm text-white shadow-sm hover:bg-green-700 sm:w-auto'
								data={exportCSV(productData)}
								// separator=';'
								// enclosingCharacter="'"
								target='_blank'
								filename={productData[0]?.batch.name + '.csv'}
							>
								Xuất báo cáo
							</CSVLink>
						</div>
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
													<td colSpan={4}>
														<div className='text-center text-lg font-semibold text-gray-500 py-10 bg-white'>
															Đang tải, chờ xíu nghen...
														</div>
													</td>
												</tr>
											) : (
												productData.map((item, index) => (
													<tr key={index}>
														<td
															className={clsx(
																index !== productData.length - 1 &&
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
																	<div className='font-medium text-gray-900'>
																		{item.code_product.name}
																	</div>
																	<div className='text-gray-500 text-xs'>
																		{
																			item.code_product
																				.categoryProduct
																				.name
																		}
																	</div>
																</div>
															</div>
														</td>

														<td
															className={clsx(
																index !== productData.length - 1 &&
																	'border-b border-gray-200',
																'whitespace-nowrap px-3 py-4 text-sm text-gray-500 font-semibold'
															)}
														>
															{item.code_product.barcode?.current ||
																'-'}
														</td>
														<td
															className={clsx(
																index !== productData.length - 1 &&
																	'border-b border-gray-200',
																'whitespace-nowrap px-3 py-4 text-sm text-gray-500 hidden sm:table-cell'
															)}
														>
															{item.rfid || '-'}
														</td>
														<td
															className={clsx(
																index !== productData.length - 1 &&
																	'border-b border-gray-200',
																'whitespace-nowrap px-3 py-4 text-sm text-gray-500 hidden lg:table-cell'
															)}
														>
															{item._id || '-'}
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
			</div>
		</>
	)
}
export default Detail
