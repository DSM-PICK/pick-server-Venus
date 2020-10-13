import * as Joi from "joi";

export default Joi.object()
  .keys({
    numAndName: Joi.string().required(),
  })
  .unknown();
