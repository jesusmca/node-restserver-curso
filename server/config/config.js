// PUERTO

process.env.PORT = process.env.PORT || 3000;

// Entorno

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// Vencimiento del token 
//60 Segundos 
//60 minutos
//24 horas
//30 dias

process.env.CADUCIDAD_TOKEN = '48h'; //60 * 60 * 24 * 30;


// Seed de autenticacion

process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo-mio';



// Base de datos

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe'
} else {
    urlDB = process.env.MONGO_URI
}

process.env.URLDB = urlDB;

process.env.CLIENT_ID = process.env.CLIENT_ID || '619096771400-i4odbfonrvjinanr0nd1ef8qlca7q7q9.apps.googleusercontent.com';