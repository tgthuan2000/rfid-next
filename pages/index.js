import Head from 'next/head'
import Link from 'next/link'
import NumberFormat from 'react-number-format'
import { SLUG } from '../constants/slug'
import { urlFor } from '../sanity/client'
import Image from 'next/image'
import { useQueries } from '../hooks/useQuery'
import { rfid } from '../sanity/query'
import clsx from 'clsx'
import { Waypoint } from 'react-waypoint'
import { CSVLink } from 'react-csv'

const headers = ['Sản phẩm', 'Barcode', 'Giá', 'Số lượng']

const Home = () => {
	const { store: productData, loading, isEnd, refetch } = useQueries(rfid.GET_LIST)
	return (
		<>
			<Head>
				<title>Dashboard | Home</title>
			</Head>
			<div>
				<div className='px-4 sm:px-6 lg:px-8'>
					<div className='sm:flex sm:items-center -mx-4 sm:-mx-6 lg:-mx-8'>
						<div className='sm:flex-auto'>
							<h1 className='text-3xl font-semibold text-gray-900'>Trang chủ</h1>
						</div>
						<div className='mt-4 sm:mt-0 sm:ml-16 sm:flex-none'>
							<CSVLink
								className='min-w-[120px] inline-flex font-semibold items-center justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm text-white shadow-sm hover:bg-green-700 sm:w-auto'
								data={productData}
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
												<th
													scope='col'
													className='sticky top-0 z-10 border-b border-gray-300 bg-gray-50 bg-opacity-75 py-3.5 pr-4 pl-3 backdrop-blur backdrop-filter sm:pr-6 lg:pr-8'
												>
													<span className='sr-only'>Edit</span>
												</th>
											</tr>
										</thead>
										<tbody className='bg-white'>
											{productData.map((item, index) => (
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
																	src={urlFor(item.image)}
																	alt=''
																	layout='fixed'
																	width={60}
																	height={60}
																/>
															</div>
															<div>
																<div className='font-medium text-gray-900'>
																	{item.name}
																</div>
																<div className='text-gray-500 text-xs'>
																	{item.categoryProduct.name}
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
														{item.barcode?.current || '-'}
													</td>
													<td
														className={clsx(
															index !== productData.length - 1 &&
																'border-b border-gray-200',
															'whitespace-nowrap px-3 py-4 text-sm text-gray-500 hidden sm:table-cell'
														)}
													>
														<NumberFormat
															value={item.price}
															displayType='text'
															thousandSeparator
														/>
													</td>
													<td
														className={clsx(
															index !== productData.length - 1 &&
																'border-b border-gray-200',
															'whitespace-nowrap px-3 py-4 text-sm text-gray-500 hidden lg:table-cell'
														)}
													>
														<NumberFormat
															value={item.quantity}
															displayType='text'
															thousandSeparator
														/>
													</td>
													<td
														className={clsx(
															index !== productData.length - 1 &&
																'border-b border-gray-200',
															'relative whitespace-nowrap py-4 pr-4 pl-3 text-right text-sm font-medium sm:pr-6 lg:pr-8'
														)}
													>
														<Link
															href={
																SLUG.PRODUCT +
																'/' +
																item.slug?.current
															}
															passHref
														>
															<a className='text-cyan-600 font-semibold underline hover:text-cyan-900'>
																Sửa
																<span className='sr-only'></span>
															</a>
														</Link>
													</td>
												</tr>
											))}
										</tbody>
									</table>
									{!isEnd && loading ? (
										<div className='text-center text-lg font-semibold text-gray-500 py-10 bg-white'>
											Đang tải, chờ xíu nghen...
										</div>
									) : (
										<Waypoint onEnter={refetch} />
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
export default Home
