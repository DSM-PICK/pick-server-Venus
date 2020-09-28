import * as Joi from "joi";

export default Joi.object()
  .keys({
    name: Joi.string().required(),
    location: Joi.string().required(),
    teacher: Joi.string().required(),
    club_head: Joi.string().required(),
  })
  .unknown();
