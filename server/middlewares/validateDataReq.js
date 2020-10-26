const Joi = require('joi');
const { createJSONResponse } = require('../helpers/index');

/*
* Valida mediante Joi que los datos para loguearse esten informados 
*/
const validateDataLogin = (req, res, next) => {

    const { email, password } = req.body;

    const schema = Joi.object({
        email: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'ar', 'net'] } })
            .required(),
        password: Joi.string()
            .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
            .required(),
    });

    const { error, value } = schema.validate({ email: email, password: password });
    
    if (error) {
        const messageError = { message: error.details[0].message, path: error.details[0].path };
        return res.status(401).json(createJSONResponse(false, messageError));
    }

    next();
}

module.exports = {
    validateDataLogin,
}