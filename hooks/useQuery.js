import { client } from '../sanity/client'
import { useState, useEffect, useCallback } from 'react'

const useQuery = (query) => {
	const [loading, setLoading] = useState(true)
	const [data, setData] = useState([])

	const fetch = useCallback(async () => {
		try {
			setLoading(true)
			const data = await client.fetch(query)
			if (data.length > 0) {
				setData(data)
			}
		} catch (err) {
			console.log({ err })
		} finally {
			setLoading(false)
		}
	}, [query])

	useEffect(() => {
		fetch()
	}, [fetch])

	return { loading, data }
}

const useQueries = (query, param = {}) => {
	const [loading, setLoading] = useState(true)
	const [store, setData] = useState([])
	const [params, setParams] = useState({
		start: 0,
		end: 10,
		...param,
	})
	const [isEnd, setIsEnd] = useState(false)

	const fetch = useCallback(async () => {
		try {
			setLoading(true)

			if (Object.keys(params).some((param) => !query.includes(param))) {
				throw new Error('Params invalid!!!')
			}
			const data = await client.fetch(query, params)
			if (data.length > 0) {
				setData((prev) => [...prev, ...data])
			} else {
				setIsEnd(true)
			}
		} catch (err) {
			console.log({ err })
		} finally {
			setLoading(false)
		}
	}, [params, query])

	useEffect(() => {
		fetch()
	}, [fetch])

	const refetch = () => {
		setParams({ ...params, start: params.end, end: params.end + 10 })
	}

	return {
		loading,
		store,
		isEnd,
		refetch,
	}
}

export { useQueries, useQuery }
