const { OAuth2Client } = require('google-auth-library');
const Joi = require('joi');

const createJSONResponse = (ok, message) => {

    let jsonResp = { ok };

    if (!ok) {
        jsonResp.err = message
    } else {
        jsonResp.data = message
    }

    return jsonResp;
}


const verifyTokenGoogle = async (token, CLIENT_ID) => {

    const client = new OAuth2Client(CLIENT_ID);

    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,  
        // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });

    const payload = ticket.getPayload();
    const userid = payload['sub'];
    // If request specified a G Suite domain:
    // const domain = payload['hd'];

    return {
        name: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }

}

const validateDataNewUser = (userData) => {

    // Object a retornar
    let err = null;

    // Schema de validacion
    const schema = Joi.object({
        name: Joi.string()
            .min(3)
            .max(50)
            .required(),
        email: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'ar', 'net'] } })
            .required(),
        password: Joi.string()
            .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
            .required(),
    });

    // Valida datos a dar de alta como usuario
    const { error, value } = schema.validate({ name: userData.name, email: userData.email, password: userData.password });

    if (error) {
        const messageError = { message: error.details[0].message, path: error.details[0].path };
        err = { status: 500, message: messageError };
    }

    return err;

}

module.exports = {
    createJSONResponse,
    verifyTokenGoogle,
    validateDataNewUser
}