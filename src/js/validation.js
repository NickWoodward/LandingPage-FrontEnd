const Joi = require('@hapi/joi');

export const validateListItem = item => {
    const schema = Joi.object({
        id: Joi.string().required(),
        title: Joi.string().min(5).required(),
        content: Joi.string(),
        author: Joi.string().min(2).required(),
        completed: Joi.boolean()
    });

    return schema.validate(item);
};

export const validateLogin = (email, password) => {
    const schema = Joi.object({
        email: Joi.string().required().email({ minDomainSegments: 2, tlds: { allow: ['com', 'uk', 'net'] } }),
        password: Joi.string().required()
    });

    return schema.validate({email: email, password: password});
};