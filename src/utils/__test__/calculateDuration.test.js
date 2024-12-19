import { calculateDuration } from '../calculateDuration.js';
import { ErrorHandler } from '../../middlewares/error';

jest.mock('../../middlewares/error');

describe('calculateDuration', () => {
  it('should correctly calculate duration in minutes', () => {
    const departureTime = '2024-10-27T10:00:00.000Z';
    const arrivalTime = '2024-10-27T10:30:00.000Z';
    expect(calculateDuration(departureTime, arrivalTime)).toBe('0d 0h 30m');
  });

  it('should correctly calculate duration in hours', () => {
    const departureTime = '2024-10-27T10:00:00.000Z';
    const arrivalTime = '2024-10-27T13:00:00.000Z';
    expect(calculateDuration(departureTime, arrivalTime)).toBe('0d 3h 0m');
  });

  it('should correctly calculate duration in days', () => {
    const departureTime = '2024-10-27T10:00:00.000Z';
    const arrivalTime = '2024-10-29T10:00:00.000Z';
    expect(calculateDuration(departureTime, arrivalTime)).toBe('2d 0h 0m');
  });

  it('should correctly calculate duration with a combination of days, hours, and minutes', () => {
    const departureTime = '2024-10-27T10:00:00.000Z';
    const arrivalTime = '2024-10-29T13:30:00.000Z';
    expect(calculateDuration(departureTime, arrivalTime)).toBe('2d 3h 30m');
  });

  it('should throw ErrorHandler if arrival time is before departure time', () => {
    const departureTime = '2024-10-27T10:00:00.000Z';
    const arrivalTime = '2024-10-27T09:00:00.000Z';

    expect(() => calculateDuration(departureTime, arrivalTime)).toThrow();
    expect(ErrorHandler).toHaveBeenCalledWith(
      'Arrival time must be after departure time.'
    );
  });
});
