import { io } from '../index.js';

export class SocketIO {
  static async pushSingleNotification(userID, data) {
    io.to(userID).emit('notification:user', data);
  }

  static async pushBroadcastNotification(data) {
    if (data?.type) {
      const formattedType = data?.type.toUpperCase();

      switch (formattedType) {
        case 'INFO':
          io.emit('notification:info', data);
          break;
        case 'ACCOUNT':
          io.emit('notification:account', data);
          break;
        case 'DISCOUNT':
          io.emit('notification:discount', data);
          break;
        case 'EVENT':
          io.emit('notification:event', data);
          break;
        case 'PAYMENT':
          io.emit('notification:payment', data);
          break;
        default:
          io.emit('notification:general', data);
      }
    } else {
      io.emit('notification:broadcast', data);
    }
  }
}
