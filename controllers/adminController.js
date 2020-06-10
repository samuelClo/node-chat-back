module.exports = {
	getUsers(req, res) {
		return res.status(200).json({
			users: ['Loulou', 'Fifi', 'Riri'],
		})
	},
	getUser(req, res) {
		const {
			params: { id },
		} = req
		return res.status(200).json({
			id,
			name: 'Loulou',
		})
	},
	deleteUser(req, res) {
		const {
			params: { id },
		} = req
		return res.status(200).json({
			msg: `Utilisateur ${id} supprimé.`,
		})
	},
}
