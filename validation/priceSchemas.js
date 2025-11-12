import Joi from "joi";

export const createPriceValidationSchema = Joi.object({
  carClass: Joi.string()
    .valid("economy", "compact", "midsize", "SUV", "premium")
    .required()
    .messages({
      "any.only":
        "Class must be one of: economy, compact, midsize, SUV, premium",
      "any.required": "Please specify the car class",
    }),
  dailyPrice: Joi.number().required().messages({
    "number.base": "Price should be a number",
    "any.required": "Daily price is required",
  }),
  weekendPrice: Joi.number().less(Joi.ref("dailyPrice")).required().messages({
    "number.base": "Price should be a number",
    "number.less": "Weekend price can not be greater than daily price",
    "any.required": "Weekend price is required",
  }),
  weeklyPrice: Joi.number().less(Joi.ref("weekendPrice")).required().messages({
    "number.base": "Price should be a number",
    "number.less": "Weekly price can not be greater than weekend price",
    "any.required": "Weekly price is required",
  }),
  monthlyPrice: Joi.number().less(Joi.ref("weeklyPrice")).required().messages({
    "number.base": "Price should be a number",
    "number.less": "Monthly price can not be greater than weekly price",
    "any.required": "Monthly price is required",
  }),
});

export const updatePriceValidationSchema = createPriceValidationSchema.fork(
  ["carClass", "dailyPrice", "weekendPrice", "weeklyPrice", "monthlyPrice"],
  (schema) => schema.optional()
);
