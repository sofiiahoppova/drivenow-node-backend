import Joi from "joi";

export const createUserValidationSchema = Joi.object({
  fullName: Joi.string().max(50).required().messages({
    "string.base": "Full name must be a string",
    "string.empty": "Full name is required",
    "string.max": "Full name must not exceed 50 characters",
    "any.required": "Please provide full name",
  }),
  email: Joi.string().email().max(100).required().messages({
    "string.base": "Email must be a string",
    "string.email": "Email is invalid",
    "string.empty": "Email is required",
    "string.max": "Email must not exceed 100 characters",
    "any.required": "Please provide email",
  }),
  password: Joi.string().min(8).max(30).required().messages({
    "string.base": "Password must be a string",
    "string.empty": "Password is required",
    "string.min": "Password must not be shorter than 8 characters",
    "string.max": "Password must not exceed 30 characters",
    "any.required": "Please provide password",
  }),
  phoneNumber: Joi.string().max(15).messages({
    "string.max": "Phone number must not exceed 15 characters",
  }),
  dateOfBirth: Joi.date().iso().messages({
    "date.base": "Date of birth must be a valid date",
    "date.format":
      "The date of birth does not match the required format: YYYY-MM-DD",
  }),
  passportUrl: Joi.string().uri().messages({
    "string.uri": "Passport URL must be a valid link",
  }),
  driverLicenseUrl: Joi.string().uri().messages({
    "string.uri": "License URL must be a valid link",
  }),
});

export const updateUserValidationSchema = createUserValidationSchema.fork(
  ["fullName", "email", "password"],
  (schema) => schema.optional()
);
