'use strict';

const bcrypt = require('bcrypt');
const Joi = require('joi');

const User = require('../models/user');

const signIn = async (email, password) => {

    // Object a retornar
    let response = {
        err: null,
        userDB: null
    };

    try {

        const userDB = await User.findOne({ email });

        // Si no encuentra usuario en la BBDD
        if (!userDB) {
            response.err = { status: 404, message: 'Wrong User or Password' };
            return response;
        }

        // Si el password no es el mismo de la BBDD
        if (!bcrypt.compareSync(password, userDB.password)) {
            response.err = { status: 404, message: 'Wrong User or Password' }
            return response;
        };

        response.userDB = userDB;
        return response;

    } catch (err) {

        response.err = { status: 500, message: err.message };
        return response;
    }

}


const signInByGoogle = async (email) => {

    // Object a retornar
    let response = {
        err: null,
        userDB: null
    };

    try {

        const userDB = await User.findOne({ email });

        // Si no encuentra usuario en la BBDD
        if (!userDB) {
            response.err = { status: 404, message: 'Google User not found' };
            return response;
        }

        if (userDB.google === false) {
            response.err = { status: 400, message: 'User registered by another method' };
            return response;
        } 

        response.userDB = userDB;
        return response;

    } catch (err) {

        response.err = { status: 500, message: err.message };
        return response;
    }

}


const createUser = async (userData, google, password) => {
    
    // Object a retornar
    let response = {
        err: null,
        userDB: null
    };

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
    const { error, value } = schema.validate({ name: userData.name, email: userData.email, password });

    if (error) {
        const messageError = { message: error.details[0].message, path: error.details[0].path };
        response.err = { status: 500, message: messageError };
        return response;
    }

    let user = new User();

    user.name = userData.name
    user.email = userData.email
    user.img = userData.img
    user.google = google
    user.password = password

    try {

        const userDB = await user.save();
        response.userDB = userDB;
        return response;

    } catch (err) {

        response.err = { status: 500, message: err.message };
        return response;
    }

}

module.exports = {
    signIn,
    signInByGoogle,
    createUser
}