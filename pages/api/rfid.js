export default function handler(req, res) {
	if (!isValidRequest(req, process.env.NEXT_PUBLIC_WEBHOOK_SECRET)) {
		res.status(401).json({ success: false, message: 'Invalid signature' })
		return
	}

	console.log(res.body)

	res.json({ success: true })
}
