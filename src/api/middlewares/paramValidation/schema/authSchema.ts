import * as Joi from "joi";

export default Joi.object()
  .keys({
    Authorization: Joi.string().required(),
  })
  .unknown();
