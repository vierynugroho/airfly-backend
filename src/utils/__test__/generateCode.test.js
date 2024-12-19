import { generateCode } from '../generateCode.js';
import { v4 as uuidv4 } from 'uuid';

jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

describe('generateCode', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should pad month and day with zeroes if they are less than 10', () => {
    const mockDate = new Date('2024-01-01T10:00:00Z');
    const spy = jest.spyOn(global, 'Date').mockImplementation(() => mockDate);

    uuidv4.mockReturnValue('abcd5678');

    const result = generateCode();

    expect(result).toBe('240101ABCD');
    spy.mockRestore();
  });

  it('should generate a code in the correct format', () => {
    const mockDate = new Date('2024-12-19T10:00:00Z');
    jest.spyOn(global, 'Date').mockImplementation(() => mockDate);

    uuidv4.mockReturnValue('abcd1234');

    const result = generateCode();

    expect(result).toBe('241219ABCD');
  });
});
