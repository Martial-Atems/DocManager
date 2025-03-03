import mysql from 'mysql2';

//connection a la bdd
const connection = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    port: 3306,
    database: "DocManager",
});

export default connection;