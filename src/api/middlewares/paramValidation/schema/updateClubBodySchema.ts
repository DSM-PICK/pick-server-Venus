import * as Joi from "joi";

export default Joi.object()
  .keys({
    name: Joi.string().optional(),
    location: Joi.string().optional(),
    club_head: Joi.string().allow('').optional(),
    teacher: Joi.string().allow('').optional(),
  })
  .unknown();
