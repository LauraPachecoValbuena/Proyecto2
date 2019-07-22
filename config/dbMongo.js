const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'angelmongodb';

// Use connect method to connect to the server
 MongoClient.connect(
     url,
     {
         useNewUrlParser: true
     },
    function (err, db) {
        if (err) throw err;
        global.dbMongo = db.db(dbName);  //usamos global que es una variable xa q se pueda utilizar la db en todas partes sin tener q requerirla.
    }
 );
