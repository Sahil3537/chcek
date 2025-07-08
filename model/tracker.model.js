const db = require('../db/db');

exports.saveTracking = async(email, token) => {
  const connection = await db()
  const sql = `INSERT INTO email_tracking (email, token) VALUES (?, ?)`
  const [result]= await connection.execute(sql, [email, token])
 return result
};
exports.markAsOpened = async (token) => {

  const connection  = await db()
  const sql = `UPDATE email_tracking 
     SET opened = true, opened_at = NOW() 
     WHERE token = ? AND opened = false`
     const [result]= await connection.execute(sql,[token])
  return  result
}


exports. getByToken= async(token) =>{
  const connection = await db()
  const [rows] = await connection.execute (
    'SELECT * FROM email_tracking WHERE token = ?',
    [token]
  );
  return rows[0]; // return the first matching row
}

 exports.getAll= async () => {
  const connection = await db()
    const query = 'SELECT * FROM email_tracking ORDER BY created_at DESC';


    const [rows] = await connection.execute(query);

    return rows;
  } 