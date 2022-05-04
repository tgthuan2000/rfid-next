import Head from 'next/head'
import { client, urlFor } from 'sanity/client'
import { useQuery } from 'hooks/useQuery'
import { rfid } from 'sanity/query'
import clsx from 'clsx'
import Link from 'next/link'
import { SLUG } from 'constants/slug'
import SelectItem from 'components/SelectItem'
import { useState, useEffect } from 'react'
import Image from 'next/image'

const d = [
	{ _id: '0', name: 'Tất cả' },
	{ _id: '1', name: 'Theo đợt' },
]

const Dashboard = () => {
	const [selected, setSelected] = useState('0')
	return (
		<>
			<Head>
				<title>Dashboard | Home</title>
			</Head>
			<div>
				<div className='px-4 sm:px-6 lg:px-8'>
					<div className='sm:flex sm:items-center -mx-4 sm:-mx-6 lg:-mx-8'>
						<div className='sm:flex-auto flex justify-between items-center'>
							<h1 className='text-3xl font-semibold text-gray-900'>Trang chủ</h1>
							<div className='flex space-x-2 itém-center'>
								{selected === '0' && (
									<Link passHref href={SLUG.EXPORT}>
										<button
											type='button'
											className='mr-3 min-w-[120px] inline-flex font-semibold items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm text-white shadow-sm hover:bg-indigo-700 sm:w-auto'
										>
											Xuất báo cáo
										</button>
									</Link>
								)}
								<div className='flex items-center'>
									<span className='mr-3'>Hiển thị:</span>
									<SelectItem
										data={d}
										onChange={(e) => setSelected(e.target.value)}
									/>
								</div>
							</div>
						</div>
					</div>
					{selected === '0' && <AllView />}
					{selected === '1' && <GroupView />}
				</div>
			</div>
		</>
	)
}
export default Dashboard

const GroupView = () => {
	const headers = ['Đợt', 'Thời gian tạo', 'Cập nhật lúc', 'Số lượng']
	const { data: batchData, loading, push, deleteAt, updatedAt } = useQuery(rfid.GET_BATCH)
	useEffect(() => {
		const subscription = client.listen("*[_type == 'batch']").subscribe((data) => {
			const { documentId, result, transition } = data
			const { _createdAt, _updatedAt, count, name } = result || {}

			if (documentId.startsWith('drafts')) return

			switch (transition) {
				case 'appear': {
					push({ _id: documentId, _createdAt, _updatedAt, count, name })
					break
				}
				case 'update': {
					updatedAt(documentId, { _createdAt, _updatedAt, count, name })
					break
				}
				case 'disappear': {
					deleteAt(documentId)
					break
				}
			}
		})
		return () => {
			subscription.unsubscribe()
		}
	}, [])
	return (
		<div className='mt-6 flex flex-col'>
			<div className='-my-2 -mx-4 sm:-mx-6 lg:-mx-8'>
				<div className='inline-block min-w-full py-2 align-middle'>
					<div className='shadow-lg ring-1 ring-black ring-opacity-5'>
						<table className='min-w-full border-separate' style={{ borderSpacing: 0 }}>
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
								) : batchData.length === 0 ? (
									<tr>
										<td colSpan={4}>
											<div className='text-center text-lg font-semibold text-gray-500 py-10 bg-white'>
												Không có dữ liệu
											</div>
										</td>
									</tr>
								) : (
									batchData.map((item, index) => (
										<Link passHref href={SLUG.DASHBOARD + '/' + item._id}>
											<tr
												key={index}
												className='cursor-pointer hover:opacity-70'
											>
												<td
													className={clsx(
														index !== batchData.length - 1 &&
															'border-b border-gray-200',
														'whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6 font-semibold text-gray-800'
													)}
												>
													{item.name}
												</td>

												<td
													className={clsx(
														index !== batchData.length - 1 &&
															'border-b border-gray-200',
														'whitespace-nowrap px-3 py-4 text-sm text-gray-600'
													)}
												>
													{new Date(item._createdAt).toLocaleString()}
												</td>
												<td
													className={clsx(
														index !== batchData.length - 1 &&
															'border-b border-gray-200',
														'whitespace-nowrap px-3 py-4 text-sm text-gray-600'
													)}
												>
													{new Date(item._updatedAt).toLocaleString()}
												</td>
												<td
													className={clsx(
														index !== batchData.length - 1 &&
															'border-b border-gray-200',
														'whitespace-nowrap px-3 py-4 text-sm font-semibold',
														item.count > 0
															? 'text-green-500'
															: 'text-gray-500'
													)}
												>
													{item.count ?? '-'}
												</td>
											</tr>
										</Link>
									))
								)}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	)
}

const AllView = () => {
	const headers = ['Sản phẩm', 'Barcode', 'Thời gian tạo', 'RFID', 'ID mapping', 'Đợt']
	const { data, loading, push, deleteAt, updatedAt } = useQuery(rfid.GET_MAPPING)

	useEffect(() => {
		const subscription = client.listen("*[_type == 'mapping']").subscribe(async (data) => {
			const { documentId, result, transition } = data

			if (documentId.startsWith('drafts')) return
			let d = {}

			if (result) {
				const res = await client.fetch(rfid.GETBY_MAPPING, { _id: documentId })
				d = res[0]
			}

			const { batch, code_product, warehouse, rfid: _rfid } = d

			switch (transition) {
				case 'appear': {
					push({ _id: documentId, batch, code_product, warehouse, rfid: _rfid })
					break
				}
				case 'update': {
					updatedAt(documentId, { batch, code_product, warehouse, rfid: _rfid })
					break
				}
				case 'disappear': {
					deleteAt(documentId)
					break
				}
			}
		})
		return () => {
			subscription.unsubscribe()
		}
	}, [])

	return (
		<div className='mt-6 flex flex-col'>
			<div className='-my-2 -mx-4 sm:-mx-6 lg:-mx-8'>
				<div className='inline-block min-w-full py-2 align-middle'>
					<div className='shadow-lg ring-1 ring-black ring-opacity-5'>
						<table className='min-w-full border-separate' style={{ borderSpacing: 0 }}>
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
															src={urlFor(item.code_product.image)}
															alt=''
															layout='fixed'
															width={60}
															height={60}
														/>
													</div>
													<div>
														<div
															title={item.code_product.name}
															className='font-medium text-gray-900 truncate max-w-[20vw]'
														>
															{item.code_product.name}
														</div>
														<div className='text-gray-500 text-xs'>
															{item.code_product.categoryProduct.name}
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
											</td>{' '}
											<td
												className={clsx(
													index !== data.length - 1 &&
														'border-b border-gray-200',
													'whitespace-nowrap px-3 py-4 text-sm text-gray-600'
												)}
											>
												{new Date(item._createdAt).toLocaleString()}
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
	)
}
