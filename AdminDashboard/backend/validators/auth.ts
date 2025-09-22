import Joi from 'joi'
import passwordComplexity from 'joi-password-complexity';

const complexityOptions = {
    min: 8,
    max: 100,
    lowerCase: 1,
    upperCase: 1,
    numeric: 1,
    symbol: 1,
    requirementCount: 4
}

export const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

export const registerSchema = Joi.object({
    email: Joi.string().email().required(),
    password: passwordComplexity(complexityOptions).required(),
    role: Joi.string().valid('super_admin', 'analyst').required()
});