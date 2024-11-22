import Joi from "joi";

export const loginSchema = Joi.object({
  email: Joi.string()
    .email({
      tlds: {
        allow: ["com", "net", "id"],
      },
    })
    .required()
    .messages({
      "string.email":
        "must be a valid email & domain allowed: .com | .net | .id",
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
