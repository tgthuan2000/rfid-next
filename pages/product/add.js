import Head from 'next/head'
import ProductForm from 'components/ProductForm'

const AddProduct = () => {
	return (
		<>
			<Head>
				<title>Add product</title>
			</Head>
			<ProductForm title='Thêm sản phẩm' />
		</>
	)
}

export default AddProduct
