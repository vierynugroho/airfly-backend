

exports.validateGoogleLogin = (req, res, next) => {
    // Validation body schema
    const validateBody = z.object({
      access_token: z.string(),
    });
    // Validate
    const resultValidateBody = validateBody.safeParse(req.body);
    if (!resultValidateBody.success) {
      // If validation fails, return error messages
      throw new BadRequestError(resultValidateBody.error.errors);
    }
    next();
  };