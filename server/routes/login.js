'use strict';

const express = require('express');
const { validateDataLogin } = require('../middlewares/validateDataReq');

// Llamamos al router
const api = express.Router();

// Cargamos el controlador
const LoginController = require('../controllers/login');

//Login by email
api.post('/login', validateDataLogin, LoginController.loginByEmail);

// Login by google
api.post('/google', LoginController.loginByGoogle);

module.exports = api;
