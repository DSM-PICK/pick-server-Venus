import * as Joi from "joi";

export default Joi.object()
  .keys({
    id: Joi.string().required(),
    pw: Joi.string().required(),
  })
  .unknown();
