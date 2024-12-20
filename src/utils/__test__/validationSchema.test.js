import {
  loginSchema,
  registerSchema,
  seatSchema,
  flightSchema,
  airportSchema,
  airlineSchema,
  discountSchema,
} from '../validationSchema.js';

describe('Login Schema Validation', () => {
  it('should validate correct login data', async () => {
    const validData = {
      email: 'test@example.com',
      password: 'password123',
    };

    const { error } = loginSchema.validate(validData);
    expect(error).toBeUndefined();
  });

  it('should reject invalid email domains', async () => {
    const invalidData = {
      email: 'test@example.org',
      password: 'password123',
    };

    const { error } = loginSchema.validate(invalidData);
    expect(error).toBeDefined();
    expect(error.details[0].message).toContain(
      'must be a valid email & domain allowed'
    );
  });

  it('should reject short passwords', async () => {
    const invalidData = {
      email: 'test@example.com',
      password: '123',
    };

    const { error } = loginSchema.validate(invalidData);
    expect(error).toBeDefined();
  });
});

describe('Register Schema Validation', () => {
  it('should validate correct registration data', async () => {
    const validData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '1234567890',
      password: 'password123',
    };

    const { error } = registerSchema.validate(validData);
    expect(error).toBeUndefined();
  });

  it('should reject short phone numbers', async () => {
    const invalidData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '123456',
      password: 'password123',
    };

    const { error } = registerSchema.validate(invalidData);
    expect(error).toBeDefined();
  });
});

describe('Seat Schema Validation', () => {
  it('should validate correct seat data', async () => {
    const validData = {
      flightId: 1,
      seatNumber: 'A1',
      status: 'AVAILABLE',
      departureTime: '2024-01-01T10:00:00Z',
      arrivalTime: '2024-01-01T12:00:00Z',
    };

    const { error } = seatSchema.validate(validData);
    expect(error).toBeUndefined();
  });

  it('should reject invalid seat status', async () => {
    const invalidData = {
      flightId: 1,
      seatNumber: 'A1',
      status: 'INVALID',
      departureTime: '2024-01-01T10:00:00Z',
      arrivalTime: '2024-01-01T12:00:00Z',
    };

    const { error } = seatSchema.validate(invalidData);
    expect(error).toBeDefined();
  });

  it('should reject arrival time before departure time', async () => {
    const invalidData = {
      flightId: 1,
      seatNumber: 'A1',
      status: 'AVAILABLE',
      departureTime: '2024-01-01T10:00:00Z',
      arrivalTime: '2024-01-01T09:00:00Z',
    };

    const { error } = seatSchema.validate(invalidData);
    expect(error).toBeDefined();
    expect(error.details[0].message).toBe(
      'Arrival time must be after departure time.'
    );
  });
});

describe('Flight Schema Validation', () => {
  const validFlightData = {
    price: 100,
    class: 'ECONOMY',
    flightNumber: 'FL123',
    airlineId: 1,
    departureAirport: 1,
    arrivalAirport: 2,
    departureTime: '2024-01-01T10:00:00Z',
    arrivalTime: '2024-01-01T12:00:00Z',
    terminal: 'T1',
    information: 'Flight information',
  };

  it('should validate correct flight data', async () => {
    const { error } = flightSchema.validate(validFlightData);
    expect(error).toBeUndefined();
  });

  it('should reject same departure and arrival airport', async () => {
    const invalidData = {
      ...validFlightData,
      departureAirport: 1,
      arrivalAirport: 1,
    };

    const { error } = flightSchema.validate(invalidData);
    expect(error).toBeDefined();
    expect(error.details[0].message).toBe(
      'Arrival airport must be different from departure airport.'
    );
  });

  it('should reject invalid flight class', async () => {
    const invalidData = {
      ...validFlightData,
      class: 'INVALID',
    };

    const { error } = flightSchema.validate(invalidData);
    expect(error).toBeDefined();
  });
});

describe('Airport Schema Validation', () => {
  it('should validate correct airport data', async () => {
    const validData = {
      code: 'JFK',
      name: 'John F Kennedy International Airport',
      city: 'New York',
      country: 'United States',
      timezone: 'America/New_York',
      latitude: '40.6413',
      longitude: '-73.7781',
    };

    const { error } = airportSchema.validate(validData);
    expect(error).toBeUndefined();
  });

  it('should reject invalid latitude format', async () => {
    const invalidData = {
      code: 'JFK',
      name: 'John F Kennedy International Airport',
      city: 'New York',
      country: 'United States',
      timezone: 'America/New_York',
      latitude: 'invalid',
      longitude: '-73.7781',
    };

    const { error } = airportSchema.validate(invalidData);
    expect(error).toBeDefined();
    expect(error.details[0].message).toBe(
      'Latitude must be a valid decimal number.'
    );
  });
});

describe('Airline Schema Validation', () => {
  it('should validate correct airline data', async () => {
    const validData = {
      name: 'Test Airlines',
    };

    const { error } = airlineSchema.validate(validData);
    expect(error).toBeUndefined();
  });

  it('should reject airline name with only numbers', async () => {
    const invalidData = {
      name: '12345',
    };

    const { error } = airlineSchema.validate(invalidData);
    expect(error).toBeDefined();
  });
});

describe('Discount Schema Validation', () => {
  const validDiscountData = {
    name: 'Summer Sale',
    code: 'SUMMER2024',
    description: 'Summer season discount',
    type: 'percentage',
    value: 10,
    startDate: '2024-06-01T00:00:00Z',
    endDate: '2024-08-31T23:59:59Z',
    minPurchase: 100,
    isActive: true,
  };

  it('should validate correct discount data', async () => {
    const { error } = discountSchema.validate(validDiscountData);
    expect(error).toBeUndefined();
  });

  it('should reject end date before start date', async () => {
    const invalidData = {
      ...validDiscountData,
      startDate: '2024-08-31T00:00:00Z',
      endDate: '2024-06-01T00:00:00Z',
    };

    const { error } = discountSchema.validate(invalidData);
    expect(error).toBeDefined();
    expect(error.details[0].message).toBe(
      'End date must be after the start date.'
    );
  });

  it('should reject invalid discount type', async () => {
    const invalidData = {
      ...validDiscountData,
      type: 'invalid',
    };

    const { error } = discountSchema.validate(invalidData);
    expect(error).toBeDefined();
    expect(error.details[0].message).toBe(
      'Discount type must be either "percentage" or "fixed".'
    );
  });

  it('should reject negative discount value', async () => {
    const invalidData = {
      ...validDiscountData,
      value: -10,
    };

    const { error } = discountSchema.validate(invalidData);
    expect(error).toBeDefined();
    expect(error.details[0].message).toBe(
      'Discount value must be greater than 0.'
    );
  });
});
