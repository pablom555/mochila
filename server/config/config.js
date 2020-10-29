/*
* Port
*/ 
process.env.PORT = process.env.PORT || 3000;

/*
* Token expire in
*/
process.env.EXPIRE_TOKEN = '48h';

/*
* Autentification seed
*/
process.env.SEED = process.env.SEED || 'this-seed-dev';

/*
* Enviroment
*/
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

/*
* Data Base
*/
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/mochila';    
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB; 

/*
* Google Client Id
*/
process.env.GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '162869836804-ii4vhfdk4ogg3adno59usiftnrn406ob.apps.googleusercontent.com';
