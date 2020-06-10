const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,8}$/

const { User } = require('../models')

const jwtSecret = 'slkdjflkjsdfHGJGJG--_èç_ààé65652'
const generateJwt = (id, name, isAdmin) => {
	return jwt.sign(
		{
			iss: 'http://localhost:3000',
			id,
			name,
			isAdmin,
			exp: parseInt(Date.now() / 1000 + 60 * 60),
		},
		jwtSecret
	)
}

module.exports = {
	signup(req, res) {
		const {
			body: { username, password, email },
		} = req

		const errorMsgs = []

		if (!(password && username && email)) {
			return res.status(400).json({
				msg:
					'Missing some informations to signup (need username, password and email)',
				success: false,
			})
		}

		if (!passwordRegex.test(password))
			errorMsgs.push(
				'Password matching expression. Password must be at least 4 characters, no more than 8 characters, and must include at least one upper case letter, one lower case letter, and one numeric digit'
			)

		if (username.length > 16 || username.length < 4)
			errorMsgs.push('Name must be between 4 and 16 characters')

		if (!username.trim() || !email || !password)
			errorMsgs.push('Fields are required')

		if (!emailRegex.test(email))
			errorMsgs.push('Email is not valid, please change')

		if (errorMsgs.length > 0) {
			return res.status(400).json({
				msg: errorMsgs,
				success: false,
			})
		}

		User.findOne({ where: { email: email } }).then(emailExist => {
			if (emailExist) {
				return res.status(422).json({
					msg: 'This email is already taken',
					success: false,
				})
			}
			User.findOne({ where: { username: username } }).then(usernameExist => {
				if (usernameExist) {
					return res.status(422).json({
						msg: 'This username is already taken',
						success: false,
					})
				} 
				
				User.create({
					username: username,
					email: email,
					password: bcrypt.hashSync(password, 10),
					isAdmin: false,
				}).then(user => {
					const {id, username, isAdmin} = user
					const token = generateJwt(id, username, isAdmin)
					
					return res.status(201).json({
						msg: 'User has been register',
						token,
						success: true,
					})
				})
			})
		})
	},

	signin(req, res) {
		const {
			body: { username },
		} = req

		return res.status(200).json({
			msg: `Bienvenue ${username} !`,
		})
	},
}