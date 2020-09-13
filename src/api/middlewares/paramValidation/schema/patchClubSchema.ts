import * as Joi from "joi";

export default Joi.object()
  .keys({
    to_club_name: Joi.string().required(),
    students_num: Joi.array().required(),
  })
  .unknown();
