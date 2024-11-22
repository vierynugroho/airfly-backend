import { Authentication } from '../services/auth.js'

/**
 * 
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
export async function authHandler(req, res, next){
	try{
		const { email, password } = req.body

		const token = await Authentication.auth(email, password)

		if(token){
			return res.json({
				meta: {
					statusCode: 200,
					message: "OK"
				},
				data: {
					token
				}
			})
		}

		return res.status(401).json({
			meta: {
				statusCode: 401,
				message: "Invalid username or password"
			},
			data: {}
		})
	}
	catch(e){
		next(e)
	}
}