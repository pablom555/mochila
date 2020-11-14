'use strict';

const express = require('express');

const { verifyToken, verifyAdminRole } = require('./../middlewares/authentication');

// Llamamos al router
const api = express.Router();

// Cargamos el controlador
const UserController = require('../controllers/users');


/****** End Points ******/

// User List
api.get('/user', verifyToken, UserController.userList);

// User Register
api.post('/user', [verifyToken, verifyAdminRole], UserController.createUser);

// User Update
api.put('/user/:id', [verifyToken, verifyAdminRole], UserController.updateUser);

// User Delete
api.delete('/user/:id', [verifyToken, verifyAdminRole], UserController.deleteUser);

module.exports = api;