'use strict';

const jwt = require('jsonwebtoken');

const { createJSONResponse, verifyTokenGoogle, validateDataNewUser } = require('../helpers/index');
const UserService = require('../services/userService');

const loginByEmail = async (req, res) => {

    const { email, password } = req.body;

    const { err, userDB } = await UserService.signIn(email, password);

    if (err) return res.status(err.status).json(createJSONResponse(false, err.message));

    // Genera Token
    let token = jwt.sign({ user: userDB }, process.env.SEED, { expiresIn: process.env.EXPIRE_TOKEN });

    return res.status(200).json(createJSONResponse(true, {userDB, token}));
    
}


const loginByGoogle = async (req, res) => {

    const tokenGoogle = req.body.tokenGoogle;

    // recupera Google User
    const googleUser = await verifyTokenGoogle(tokenGoogle, process.env.GOOGLE_CLIENT_ID)
        .catch(err => res.status(403).json(createJSONResponse(false, err)));

    let { err, userDB } = await UserService.signInByGoogle(googleUser.email);

    if (err) {

        // Sino encontró user en BBDD debe crearlo
        if (err.status === 404) {

            // Valida datos del usuario a dar de alta
            const err = validateDataNewUser({name:googleUser.name, email: googleUser.email, password: 'google'});

            if (err) {
                return res.status(err.status).json(createJSONResponse(false, err.message));
            }

            const newUser = await UserService.createUser(googleUser, true, 'google');

            if (newUser.err) return res.status(newUser.err.status).json(createJSONResponse(false, newUser.err.message));

            userDB = newUser.userDB;

        } else {
            return res.status(err.status).json(createJSONResponse(false, err.message));
        }
        
    }

    // Genera Token
    let token = jwt.sign({ user: userDB }, process.env.SEED, { expiresIn: process.env.EXPIRE_TOKEN });

    return res.status(200).json(createJSONResponse(true, { userDB, token }));    

}

module.exports = {
    loginByEmail,
    loginByGoogle
};