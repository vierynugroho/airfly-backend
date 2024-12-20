import {} from 'dotenv/config';
import './config/sentry.js';
import cors from 'cors';
import express from 'express';
import router from './routes/index.js';
import logger from 'morgan';
import { errorMiddleware } from './middlewares/error.js';
import logger_format from './config/logger.js';
import { Server } from 'socket.io';
import { createServer } from 'node:http';
import * as Sentry from '@sentry/node';

const app = express();
const server = createServer(app);
export const io = new Server(server);

io.on('connection', (socket) => {
  console.log('socket connected');

  socket.on('user-room', (userID) => {
    socket.join(userID);
    console.log(`User with ID ${userID} joined room ${userID}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

app.use(
  cors({
    origin: '*',
    methods: 'GET, POST, PUT, DELETE, PATCH',
    allowedHeaders:
      'Content-Type, Authorization, Accept, Accept-Language, Accept-Encoding',
    exposedHeaders:
      'Content-Type, Authorization, Accept, Accept-Language, Accept-Encoding',
    maxAge: 3600,
  })
);

const __dirname = process.cwd();

const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', __dirname + '/src/views');

app.use(logger(logger_format.MORGAN_FORMAT));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(router);

app.get('/debug-sentry', function mainHandler() {
  throw new Error(500, 'My Awesome Sentry error!');
});

// sentry
Sentry.setupExpressErrorHandler(app);

app.use(errorMiddleware);

// 404 Response Handler
app.use((req, res) => {
  const url = req.url;
  const method = req.method;
  res.status(404).json({
    error: {
      statusCode: 404,
      message: `${method} - ${url} is not found!`,
      docs: '/api/v1/api-docs',
    },
  });
});

if (process.env.NODE_ENV !== 'test') {
  server.listen(PORT, () => {
    console.log('----------------------------------------------');
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log('----------------------------------------------');
  });
}

