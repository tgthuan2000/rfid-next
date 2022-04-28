import sanityClient from '@sanity/client'
import ImageUrlBuilder from '@sanity/image-url'

const client = sanityClient({
	projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
	dataset: process.env.NEXT_PUBLIC_DATASET,
	apiVersion: process.env.NEXT_PUBLIC_API_VERSION,
	token: process.env.NEXT_PUBLIC_TOKEN,
	useCdn: false,
})

const builder = ImageUrlBuilder(client)

const urlFor = (src) => src && builder.image(src).toString()

export { client, urlFor }
