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
			'string.email': 'must be a valid email & domain allowed: .com | .net | .id',
		}),
	password: Joi.string().min(8).required(),
});
