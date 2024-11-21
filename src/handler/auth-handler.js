/**
 * 
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
export function authHandler(req, res){
	return res.json({
		status: "OK"
	})
}