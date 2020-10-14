import * as Joi from "joi";

export default Joi.object()
  .keys({
    location: Joi.string().required(),
  })
  .unknown();
