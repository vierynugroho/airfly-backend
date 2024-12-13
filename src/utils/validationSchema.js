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
  email: Joi.string().email({
    tlds: {
      allow: ['com', 'net', 'id'],
    },
  }),
  phone: Joi.string().min(10).required(),
  password: Joi.string().min(8).required(),
});

export const updateProfileSchema = Joi.object({
  firstName: Joi.string().optional(),
  lastName: Joi.string().optional(),
  familyName: Joi.string().optional(),
  phone: Joi.string().min(10).optional(),
  role: Joi.string().valid('ADMIN', 'BUYER').optional(),
});

export const updateUserSchema = Joi.object({
  firstName: Joi.string().optional(),
  lastName: Joi.string().optional(),
  familyName: Joi.string().optional(),
  phone: Joi.string().min(10).optional(),
});

export const seatSchema = Joi.object({
  flightId: Joi.number().required(),
  seatNumber: Joi.string().required(),
  status: Joi.string().valid('AVAILABLE', 'UNAVAILABLE', 'LOCKED').required(),
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
});

export const flightSchema = Joi.object({
  price: Joi.number().min(0).required(),
  class: Joi.string()
    .valid('ECONOMY', 'FIRST', 'BUSINESS', 'PREMIUM_ECONOMY')
    .required(),
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

export const airportSchema = Joi.object({
  code: Joi.string().max(10).required(),
  name: Joi.string().required(),
  city: Joi.string().required(),
  state: Joi.string().optional(),
  country: Joi.string().required(),
  timezone: Joi.string().required(),
  latitude: Joi.string()
    .regex(/^-?\d+(\.\d+)?$/)
    .required()
    .messages({
      'string.pattern.base': 'Latitude must be a valid decimal number.',
    }),
  longitude: Joi.string()
    .regex(/^-?\d+(\.\d+)?$/)
    .required()
    .messages({
      'string.pattern.base': 'Longitude must be a valid decimal number.',
    }),
  elevation: Joi.string()
    .optional()
    .regex(/^\d+(\.\d+)?$/)
    .messages({
      'string.pattern.base': 'Elevation must be a valid decimal number.',
    }),
  image: Joi.binary()
    .optional()
    .custom((value, helpers) => {
      if (value && value.length === 0) {
        return helpers.error('any.noFileSelected'); // Error kustom
      }
      return value;
    })
    .messages({
      'binary.base': 'Image must be a file.',
      'any.noFileSelected': 'No file selected.',
    }),
});

export const airlineSchema = Joi.object({
  name: Joi.string()
    .pattern(/^(?!^\d+$).*$/, 'not only numbers') // Regex untuk memastikan string tidak hanya angka
    .required()
    .messages({
      'string.empty': 'Airline name is required.',
      'string.pattern.name': 'Airline name cannot contain only numbers.',
      'any.required': 'Airline name is required.',
    }),
  image: Joi.binary()
    .optional()
    .custom((value, helpers) => {
      if (value && value.length === 0) {
        return helpers.error('any.noFileSelected'); // Error kustom
      }
      return value;
    })
    .messages({
      'binary.base': 'Image must be a file.',
      'any.noFileSelected': 'No file selected.',
    }),
});

export const notificationSchema = Joi.object({
  type: Joi.string()
    .valid('INFO', 'DISCOUNT', 'ACCOUNT', 'EVENT', 'PAYMENT')
    .required(),
  title: Joi.string().required(),
  description: Joi.string().required(),
  isRead: Joi.boolean().required(),
  userId: Joi.number().optional(),
});

export const readNotificationSchema = Joi.object({
  notificationID: Joi.number().required(),
  isRead: Joi.boolean().required(),
});

export const QRCodeSchema = Joi.object({
  QRCodeData: Joi.object().required(),
});

export const transactionSchema = Joi.object({
  bookingId: Joi.number().required(),
});

export const webhookSchema = Joi.object({
  paymentStatus: Joi.string()
    .valid('SETTLEMENT', 'PENDING', 'CANCEL', 'EXPIRE')
    .uppercase()
    .required()
    .messages({
      'any.only': 'Payment status must be one of: SETTLEMENT, PENDING, CANCEL, EXPIRE.',
      'string.empty': 'Payment status is required.',
  }),
  paymentType: Joi.string()
    .valid('CREDIT_CARD', 'BANK_TRANSFER', 'DIGITAL_WALLET', 'PAYPAL', 'QRIS')
    .uppercase()
    .required()
    .messages({
      'any.only': 'Payment type must be one of: CREDIT_CARD, BANK_TRANSFER, DIGITAL_WALLET, PAYPAL, QRIS.',
      'string.empty': 'Payment type is required.',
  }),
  
  transaction_id: Joi.string().required().messages({
      'string.empty': 'Transaction ID is required.',
  }),

  transactionTime: Joi.string().isoDate().required().messages({
    'string.empty': 'Transaction time is required.',
    'string.isoDate': 'Transaction time must be a valid ISO date.',
  }),

});
