import { client } from '../sanity/client'
import { useState, useEffect, useCallback } from 'react'

const useQuery = (query, params = {}) => {
	const [loading, setLoading] = useState(true)
	const [data, setData] = useState([])
	const [isError, setIsError] = useState(false)

	const fetch = useCallback(async () => {
		try {
			setLoading(true)
			setIsError(false)
			const data = await client.fetch(query, params)
			if (data.length > 0) {
				setData(data)
			}
		} catch (err) {
			console.log({ err })
			setIsError(true)
		} finally {
			setLoading(false)
		}
	}, [query])

	useEffect(() => {
		fetch()
	}, [fetch])

	const push = (data) => {
		if (data) setData((prev) => [data, ...prev])
	}

	const deleteAt = (id) => {
		setData((prev) => prev.filter((item) => item._id !== id))
	}

	const updatedAt = (id, data) => {
		setData((prev) => prev.map((item) => (item._id === id ? { _id: id, ...data } : item)))
	}

	return { isError, loading, data, push, deleteAt, updatedAt }
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
