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
});

export const updateBookingValidationSchema = createBookingValidationSchema.fork(
  ["plan", "status", "startDate", "endDate", "carId"],
  (schema) => schema.optional()
);
