import { SocketIO } from '../socket.js'; // Adjust the path if needed
import { io } from '../../index.js';

jest.mock('../../index.js', () => ({
  io: {
    to: jest.fn().mockReturnThis(),
    emit: jest.fn(),
  },
}));

describe('SocketIO', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('pushSingleNotification', () => {
    it('should emit a user notification to the specified userID', async () => {
      const mockUserID = 'user123';
      const mockData = { message: 'Test notification' };

      await SocketIO.pushSingleNotification(mockUserID, mockData);

      expect(io.to).toHaveBeenCalledWith(mockUserID);
      expect(io.to().emit).toHaveBeenCalledWith('notification:user', mockData);
    });
  });

  describe('pushBroadcastNotification', () => {
    it('should emit a specific notification based on the data type', async () => {
      const testCases = [
        { type: 'INFO', event: 'notification:info' },
        { type: 'ACCOUNT', event: 'notification:account' },
        { type: 'DISCOUNT', event: 'notification:discount' },
        { type: 'EVENT', event: 'notification:event' },
        { type: 'PAYMENT', event: 'notification:payment' },
        { type: 'OTHER', event: 'notification:general' },
      ];

      for (const testCase of testCases) {
        const mockData = { type: testCase.type, message: 'Test broadcast' };

        await SocketIO.pushBroadcastNotification(mockData);

        expect(io.emit).toHaveBeenCalledWith(testCase.event, mockData);
      }
    });

    it('should emit a broadcast notification when no type is provided', async () => {
      const mockData = { message: 'Test broadcast without type' };

      await SocketIO.pushBroadcastNotification(mockData);

      expect(io.emit).toHaveBeenCalledWith('notification:broadcast', mockData);
    });
  });
});
