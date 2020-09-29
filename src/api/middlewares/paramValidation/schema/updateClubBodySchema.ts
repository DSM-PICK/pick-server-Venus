import * as Joi from "joi";

export default Joi.object()
  .keys({
    name: Joi.string().optional(),
    location: Joi.string().optional(),
    club_head: Joi.string().optional(),
    teacher: Joi.string().optional(),
  })
  .unknown();
