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
//  BD
//===================
let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/Cafe';
} else {
    urlDB = 'mongodb+srv://sa:systemadministrator@cluster0.2toca.mongodb.net/Cafe';
}
process.env.URLDB = urlDB;