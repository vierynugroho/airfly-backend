import Joi from 'joi';

export const loginSchema = Joi.object({
  email: Joi.string()
    .email({
      tlds: {
        allow: ['com', 'net', 'id'],
      },
    })
    .required()
    .messages({
      'string.email':
        'must be a valid email & domain allowed: .com | .net | .id',
    }),
  password: Joi.string().min(8).required(),
});

export const registerSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().min(10).required(),
  password: Joi.string().min(8).required(),
});

export const seatSchema = Joi.object({
  flightId: Joi.number().required(),
  seatNumber: Joi.string().required(),
  price: Joi.number().min(0).required(),
  class: Joi.string().valid('ECONOMY', 'FIRST', 'BUSINESS').required(),
  status: Joi.string().valid('AVAILABLE', 'UNAVAILABLE', 'LOCKED').required(),
});

export const flightSchema = Joi.object({
  flightNumber: Joi.string().required(),
  airlineId: Joi.number().positive().required(),
  departureAirport: Joi.number().positive().required(),
  arrivalAirport: Joi.number()
    .positive()
    .required()
    .custom((value, helpers) => {
      const departureAirport = helpers.state.ancestors[0].departureAirport;
      if (value === departureAirport) {
        return helpers.error('arrivalAirport.sameAsDeparture');
      }
      return value;
    }, 'Arrival airport validation')
    .messages({
      'arrivalAirport.sameAsDeparture':
        'Arrival airport must be different from departure airport.',
    }),
  departureTime: Joi.date().iso().required(),
  arrivalTime: Joi.date()
    .iso()
    .required()
    .custom((value, helpers) => {
      const departureTime = helpers.state.ancestors[0].departureTime;
      if (value <= departureTime) {
        return helpers.error('arrivalTime.beforeDeparture');
      }
      return value;
    }, 'Arrival time validation')
    .messages({
      'arrivalTime.beforeDeparture':
        'Arrival time must be after departure time.',
    }),
  terminal: Joi.string().required(),
  information: Joi.string().required(),
});
