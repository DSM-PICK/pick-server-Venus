import * as Joi from "joi";

export default Joi.object()
  .keys({
    num_and_name: Joi.string().required(),
  })
  .unknown();
