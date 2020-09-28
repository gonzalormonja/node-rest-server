//===================
//  PUERTO
//===================
//process.env.PORT es de heroku
process.env.PORT = process.env.PORT || 3000;


//===================
//  ENTORNO
//===================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


//===================
//  VENCIMIENTO DE TOKEN
//===================
// 60 segundos
// 60 minutos
// 24 hs
// 30 dias

process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;


//===================
//  SEED de auth
//===================
process.env.SEED = process.env.SEED || 'este-es-mi-seed-desarrollo';

//===================
//  BD
//===================
let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/Cafe';
} else {
    urlDB = process.env.MONGO_URI;
}
process.env.URLDB = urlDB;

//===================
//  GOOGLE CLIENT ID
//===================

process.env.CLIENT_ID = process.env.CLIENT_ID || "487042604464-5c1mp2hplp4fagcbppese4isk4jpvcq1.apps.googleusercontent.com";