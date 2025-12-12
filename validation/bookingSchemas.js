import Joi from "joi";

export const createBookingValidationSchema = Joi.object({
  plan: Joi.string().valid("fullCoverage", "basicPlan").required().messages({
    "any.only": "Plan must be one of: fullCoverage, basicPlan",
    "any.required": "Please specify the plan",
  }),
  status: Joi.string().valid("pending", "confirmed", "cancelled", "completed"),
  startDate: Joi.date()
    .min(new Date().getDay() - 1)
    .less(Joi.ref("endDate"))
    .required()
    .messages({
      "date.base": "Date of birth must be a valid date",
      "date.min": "Start date can not be earlier than today",
      "date.less": "Start date should be earlier than End date",
      "date.format":
        "The date of birth does not match the required format: YYYY-MM-DD",
    }),
  endDate: Joi.date().required().messages({
    "date.base": "Date of birth must be a valid date",
    "date.format":
      "The date of birth does not match the required format: YYYY-MM-DD",
  }),
  carId: Joi.number().integer().required().messages({
    "number.base": "Car Id must be a number",
    "number.integer": "Car Id must be a valid integer",
    "any.required": "Please add car id",
  }),
  user: Joi.object({
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
    phoneNumber: Joi.string().max(15).required().messages({
      "string.max": "Phone number must not exceed 15 characters",
      "any.required": "Please provide phone number",
    }),
    dateOfBirth: Joi.string()
      .pattern(/^\d{4}-\d{2}-\d{2}$/)
      .required()
      .messages({
        "string.pattern.base":
          "Date of birth does not match the required format: YYYY-MM-DD",
        "any.required": "Please provide date of birth",
      }),
    passportSerial: Joi.string().max(50).messages({
      "string.base": "Password serial number must be a string",
      "string.max": "Password serial number must not exceed 50 characters",
    }),
    driverLicenseSerial: Joi.string().max(50).messages({
      "string.base": "Driver's license serial number must be a string",
      "string.max":
        "Driver's license serial number must not exceed 50 characters",
    }),
  }),
});

export const updateBookingValidationSchema = createBookingValidationSchema.fork(
  ["plan", "status", "startDate", "endDate", "carId"],
  (schema) => schema.optional()
);
