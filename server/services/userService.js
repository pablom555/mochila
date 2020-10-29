'use strict';

const bcrypt = require('bcrypt');

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

    let user = new User();

    user.name = userData.name;
    user.email = userData.email;
    user.img = (google)? userData.img: null;
    user.google = google;
    user.password = password;

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