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