const Joi = require('joi');

const strongPasswordRegex =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
const stringPassswordError = new Error(
  'Password must be strong. At least one upper case alphabet. At least one lower case alphabet. At least one digit. At least one special character. Minimum eight in length'
);

async function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().required(),
    password: Joi.string()
      .regex(strongPasswordRegex)
      .error(stringPassswordError)
      .required(),
    email: Joi.string().required().email(),
    user_name: Joi.string().required(),
    gender: Joi.string().required(),
    mobile: Joi.string()
      .regex(/^[0-9]{10}$/)
      .messages({ 'string.pattern.base': `Phone number must have 10 digits.` })
      .required(),
  });
  return schema.validate(user, { abortEarly: false });
}

module.exports = {
  validateUser,
};
