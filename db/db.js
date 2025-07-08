// db.js
const mysql = require('mysql2/promise');

const db =async()=>{

    try {
        const connection =await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'trackerdb'

})
console.log(`db connected`)
  return connection
    } catch (error) {
        console.log(`error in db${error.message}`)
    }

} 





module.exports = db;


