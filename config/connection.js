<<<<<<< HEAD
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
=======
import mysql from 'mysql2';

//connection a la bdd
const connection = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    port: 3306,
    database: "projet_bd",
});

export default connection;
>>>>>>> 542e4fef0fe630f66727a9a546df5c4056eb763a
