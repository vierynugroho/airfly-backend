import express from 'express'
import { authRouter } from './routes/auth.js'
import dotenv from 'dotenv'

dotenv.config()

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.get('/', (req, res) => {
	return res.json({
		message: "Hello World"
	})
})

app.use('/api/v1/auth', authRouter)

app.listen(process.env.PORT || 3000, () => console.log(`Run at port ${process.env.PORT || 3000}`))