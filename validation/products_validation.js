import Joi from "joi";

export const addProductValidation = Joi.object({
  name_product: Joi.string().max(100).required(),
  content: Joi.string().max(100).required(),
  amount: Joi.number().required(),
});
