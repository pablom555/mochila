'use strict';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const _ = require('underscore');
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

const userList = async (req, res) => {

     let from = req.query.from || 0;
     from = Number(from)

     let limit = req.query.limit || 5;
     limit = Number(limit)

     let userActives = {state: true};

    const { err, usersDB } = await UserService.listUsers(userActives, from, limit);

    if (err) return res.status(err.status).json(createJSONResponse(false, err.message));

    return res.status(200).json(createJSONResponse(true, usersDB));

}

const updateUser = async (req, res) => {
    
    let id = req.params.id

    // Con la funcion pick de underscode me quedo solo con las propiedades que quiero actualizar del objeto
    let body = _.pick(req.body, 'name', 'email', 'role', 'state');

    const { err, userDB } = await UserService.updateUser(id, body);

    if (err) return res.status(err.status).json(createJSONResponse(false, err.message));

    return res.status(200).json(createJSONResponse(true, userDB));

}

const deleteUser = async (req, res) => {

    let id = req.params.id
    let body = { state: false };

    const { err, userDB } = await UserService.updateUser(id, body);

    if (err) return res.status(err.status).json(createJSONResponse(false, err.message));

    return res.status(200).json(createJSONResponse(true, userDB));

}

module.exports = {
    createUser,
    userList,
    updateUser,
    deleteUser
}