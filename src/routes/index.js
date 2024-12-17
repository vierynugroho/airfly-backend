import express from 'express';
import authRoute from './auth.js';
import userRoute from './user.js';
import seatRoute from './seat.js';
import notificationRoute from './notification.js';
import flightRoute from './flight.js';
import airportRoute from './airport.js';
import airlineRoute from './airline.js';
import paymentRoute from './payment.js';
import adminRoute from './admin.js';
import * as swaggerUI from 'swagger-ui-express';
import { bookingRoute } from './booking.js';
import YAML from 'yamljs';
import { ticketRouter } from './ticket.js';

const swaggerDoc = YAML.load('./public/docs/swagger.yml');

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
    customCssUrl:
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.js',
    ],
  })
);

router.use('/api/v1/auth', authRoute);
router.use('/api/v1/users', userRoute);
router.use('/api/v1/seats', seatRoute);
router.use('/api/v1/flights', flightRoute);
router.use('/api/v1/airports', airportRoute);
router.use('/api/v1/booking', bookingRoute);
router.use('/api/v1/airlines', airlineRoute);
router.use('/api/v1/notifications', notificationRoute);
router.use('/api/v1/payment', paymentRoute);
router.use('/api/v1/tickets', ticketRouter);
router.use('/api/v1/admin', adminRoute);
export default router;
