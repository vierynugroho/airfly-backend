import express from 'express'
import { authRouter } from './routes/auth'

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.get('/', (req, res) => {
	return res.json({
		message: "Hello World"
	})
})

app.use('/api/v1/auth', authRouter)