import {} from 'dotenv/config';
import cors from 'cors';
import express from 'express';
import router from './routes/index.js';
import logger from 'morgan';
import { errorMiddleware } from './middlewares/error.js';
import logger_format from './config/logger.js';

const app = express();
const __dirname = process.cwd();
const PORT = process.env.PORT || 3000;

app.use(
	cors({
		origin: '*',
		methods: 'GET, POST, PUT, DELETE, PATCH',
		allowedHeaders: 'Content-Type, Authorization, Accept, Accept-Language, Accept-Encoding',
		exposedHeaders: 'Content-Type, Authorization, Accept, Accept-Language, Accept-Encoding',
		maxAge: 3600,
	})
);

app.set('view engine', 'ejs');
app.set('views', __dirname + '/src/views');

app.use(logger(logger_format.MORGAN_FORMAT));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(router);

app.use(errorMiddleware);

// 404 Response Handler
app.use((req, res) => {
	const url = req.url;
	const method = req.method;
	res.status(404).json({
		error: {
			statusCode: 404,
			message: `${method} - ${url} is not found!`,
		},
	});
});

app.listen(PORT, () => {
	console.log('----------------------------------------------');
	console.log(`Server is running on http://localhost:${PORT}`);
	console.log('----------------------------------------------');
});
