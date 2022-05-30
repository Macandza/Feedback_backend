const mysql = require('mysql')
const logger = require('../logger')
require('dotenv').config()

// const dbConnectionConfig = {
//     connectionLimit : 10,
//     host: "54.171.240.247",
//     user: "root",
//     password: "rX6SZt8MNWU7Ue",
//     database: "FuliziaBiashara",
//     port: 3306,
//     debug: false,
//     connectTimeout: 60 * 1000,

// }

const connectDB = mysql.createPool({
    connectionLimit : 50,
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "customer_feedback",
    port: 3306,
    connectTimeout: 60 * 1000,
  });

module.exports = connectDB

// const connectDB = mysql.createPool (dbConnectionConfig)

// try {
//     connectDB.getConnection((error, conn) => {
//         if  (error) {
//             loggger.error(`Error connecting to the database ...`, error)
//             console.log(`Error connecting to database...`, error)
//             setTimeout(connPool, 2000)
//         } else {
//             console.log(`Database connected...`)
//             conn.release()
//         }
//     })
// } catch (error) {
//     logger.error(error)
//     console.log(error)
// }

// module.exports = connectDB