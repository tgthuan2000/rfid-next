import Head from 'next/head'
import ProductForm from '../../components/ProductForm'
import { client } from '../../sanity/client'
import { product } from '../../sanity/query'

const DetailProduct = ({ data }) => {
	return (
		<>
			<Head>
				<title>Edit product</title>
			</Head>
			<ProductForm title='Sửa sản phẩm' data={data} />
		</>
	)
}

export default DetailProduct

export const getStaticProps = async (context) => {
	const { id } = context.params
	const [data] = await client.fetch(product.GET_ONE, { slug: id })

	return { props: { data: data || null } }
}

export const getStaticPaths = async () => {
	const data = await client.fetch(product.GET_ALL)
	const paths = data.map((item) => ({
		params: { id: item.slug?.current || null },
	}))
	return { paths, fallback: false }
}
