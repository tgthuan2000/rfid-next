import { useRouter } from 'next/router'
import InputItem from './InputItem'
import TextaereaItem from './TextaereaItem'
import SelectItem from './SelectItem'
import AvatarItem from './AvatarItem'
import { useQuery } from 'hooks/useQuery'
import { categoryProduct } from 'sanity/query'
import { Controller, useForm } from 'react-hook-form'
import { useEffect } from 'react'
import { client } from 'sanity/client'

const ProductForm = ({ title }) => {
	const { data: selectData, loading: selectLoading } = useQuery(categoryProduct.GET_ALL)

	const router = useRouter()

	const { control, handleSubmit, setValue } = useForm({
		defaultValues: {
			avatar: null,
			name: '',
			desc: '',
			category: null,
			price: 0,
			quantity: 0,
		},
	})

	useEffect(() => {
		if (selectData.length > 0) setValue('category', selectData[0]._id)
	}, [selectData])

	const onSubmit = (data) => {
		const { avatar, name, desc, category, price, quantity } = data
		client
			.create({
				_type: 'product',
				categoryProduct: {
					_ref: category,
					_type: 'reference',
				},
				image: {
					_type: 'image',
					asset: {
						_ref: avatar,
						_type: 'reference',
					},
				},
				description: desc,
				name,
				price: Number(price),
				quantity: Number(quantity),
			})
			.then(() => {
				router.back()
			})
			.catch((error) => console.log(error))
	}

	return (
		<div>
			<form className='space-y-8 divide-y divide-gray-200' onSubmit={handleSubmit(onSubmit)}>
				<div>
					<div className='flex justify-between items-center'>
						<h1 className='text-3xl font-semibold text-gray-900'>{title}</h1>
						<div className='mt-4 sm:mt-0 sm:ml-16 sm:flex-none grid gap-2 grid-cols-1 sm:grid-cols-2'>
							<button
								onClick={() => router.back()}
								type='button'
								className='min-w-[120px] inline-flex font-semibold items-center justify-center rounded-md border border-transparent bg-gray-600 px-4 py-2 text-sm text-white shadow-sm hover:bg-gray-700 sm:w-auto'
							>
								Hủy bỏ
							</button>
							<button
								type='submit'
								className='min-w-[120px] inline-flex font-semibold items-center justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm text-white shadow-sm hover:bg-red-700 sm:w-auto'
							>
								Lưu
							</button>
						</div>
					</div>
					<div className='w-full bg-white px-8 pt-8 pb-20 rounded-lg mt-6'>
						<div className='max-w-4xl mx-auto grid grid-cols-1 gap-y-6 lg:gap-x-10 md:gap-x-8 sm:gap-x-6 sm:grid-cols-6'>
							<Controller
								control={control}
								name='avatar'
								render={({ field }) => (
									<AvatarItem label='Hình ảnh' onChange={field.onChange} />
								)}
							/>

							<Controller
								control={control}
								name='name'
								render={({ field }) => (
									<InputItem label='Tên sản phẩm' {...field} />
								)}
							/>

							<Controller
								control={control}
								name='category'
								render={({ field }) => (
									<SelectItem
										label='Loại sản phẩm'
										data={selectData}
										loading={selectLoading}
										{...field}
									/>
								)}
							/>

							<Controller
								control={control}
								name='price'
								render={({ field }) => (
									<InputItem label='Giá sản phẩm' type='number' {...field} />
								)}
							/>

							<Controller
								control={control}
								name='quantity'
								render={({ field }) => (
									<InputItem label='Số lượng tồn' type='number' {...field} />
								)}
							/>

							<Controller
								control={control}
								name='desc'
								render={({ field }) => <TextaereaItem label='Mô tả' {...field} />}
							/>
						</div>
					</div>
				</div>
			</form>
		</div>
	)
}

export default ProductForm
