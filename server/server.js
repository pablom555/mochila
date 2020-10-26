'use strict';

const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const path = require('path');

require('./config/config');

const app = express();

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Habilitar carpeta public
app.use(express.static(path.resolve(__dirname, './../public')));

// Configuracion de rutas globales
app.use('/api', require('./routes/index'));

// Le indicamos a Mongoose que haremos la conexión con Promesas
mongoose.Promise = global.Promise;

// Usamos el método connect para conectarnos a nuestra base de datos
mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
    .then(() => {

        console.log("La conexión a la base de datos mochila se ha realizado correctamente")

        app.listen(process.env.PORT, () => {
            console.log(`Runing in ${process.env.PORT}`)
        })

    })
    .catch(err => console.log(err));