const mysql = require("mysql");
//create connection to database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'laura',
    password: 'pac',
    database: 'angel'
});

//connect to database
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to database');
});

module.exports = db;