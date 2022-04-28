import { useRouter } from 'next/router'
import InputItem from './InputItem'
import TextaereaItem from './TextaereaItem'
import SelectItem from './SelectItem'
import AvatarItem from './AvatarItem'
import { useQuery } from '../hooks/useQuery'
import { categoryProduct } from '../sanity/query'

const ProductForm = ({ title, data = {} }) => {
	const { data: selectData, loading: selectLoading } = useQuery(categoryProduct.GET_ALL)
	const router = useRouter()

	return (
		<div>
			<form className='space-y-8 divide-y divide-gray-200'>
				<div>
					<div className='flex justify-between items-center'>
						<h1 className='text-3xl font-semibold text-gray-900'>{title}</h1>
						<div className='mt-4 sm:mt-0 sm:ml-16 sm:flex-none grid gap-2 grid-cols-1 sm:grid-cols-2'>
							<button
								onClick={router.back}
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
					<div className='max-w-5xl mx-auto bg-white p-8 rounded-lg mt-6 grid grid-cols-1 gap-y-6 lg:gap-x-10 md:gap-x-8 sm:gap-x-6 sm:grid-cols-6'>
						<AvatarItem label='Hình ảnh' data={data.image} />
						<TextaereaItem
							label='Mô tả'
							name='description'
							defaultValue={data.description}
						/>
						<InputItem defaultValue={data.name} label='Tên sản phẩm' name='name' />
						<InputItem
							defaultValue={data.barcode?.current}
							label='Barcode'
							disabled
							name='barcode'
						/>
						<SelectItem
							label='Loại sản phẩm'
							name='categoryProduct'
							data={selectData}
							loading={selectLoading}
							selectedValue={data.categoryProduct}
						/>
						<InputItem
							defaultValue={data.price}
							label='Giá sản phẩm'
							name='price'
							type='number'
						/>
						<InputItem
							defaultValue={data.quantity}
							label='Số lượng tồn'
							name='quantity'
							type='number'
						/>
					</div>
				</div>
			</form>
		</div>
	)
}

export default ProductForm
