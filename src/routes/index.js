import express from 'express';
import authRoute from './auth.js';
import seatRoute from './seat.js';
import * as swaggerUI from 'swagger-ui-express';
import { readFileSync } from 'fs';
const swaggerDoc = JSON.parse(readFileSync('./public/docs/swagger.json'));

const router = express.Router();

router.get('/api/v1', (req, res) => {
	res.status(200).json({
		statusCode: 200,
		message: 'Welcome to API Team 1',
		docs: '/api/v1/api-docs',
	});
});

router.use(
	'/api/v1/api-docs',
	swaggerUI.serve,
	swaggerUI.setup(swaggerDoc, {
		customCssUrl: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
		customJs: ['https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.js', 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.js'],
	})
);
router.use('/api/v1/auth', authRoute);
router.use('/api/v1/seat', seatRoute);

export default router;
