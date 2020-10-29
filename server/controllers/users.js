'use strict';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserService = require('../services/userService');
const { createJSONResponse, validateDataNewUser } = require('../helpers/index');

const createUser = async (req, res) => {    

    let body = req.body;

    // Valida datos del usuario a dar de alta
    const errVal = validateDataNewUser(body);

    if (errVal) {
        return res.status(errVal.status).json(createJSONResponse(false, errVal.message));
    }

    let userBody = {
        name: body.name,
        email: body.email
    }

    // Encripta el password
    let passBcrypt = bcrypt.hashSync(body.password, 10);

    const { err, userDB } = await UserService.createUser(userBody, false, passBcrypt);

    if (err) return res.status(err.status).json(createJSONResponse(false, err.message));

    // Genera Token
    let token = jwt.sign({ user: userDB }, process.env.SEED, { expiresIn: process.env.EXPIRE_TOKEN });

    return res.status(201).json(createJSONResponse(true, { userDB, token }));

}

module.exports = {
    createUser  
}