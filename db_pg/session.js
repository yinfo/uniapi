const {Pool} = require('pg')
const {dbError} = require('./db_errors')
const connectionString = $storage.getConnectionStringPostgres()
const pool = new Pool({connectionString})
// const uniqid = require('uniqid')

module.exports = {
//-------------------------------------------------------------------------------
//--------------------------- test_json ---------------------------------------
//-------------------------------------------------------------------------------
    createTable: async function () {

        const createTableText = `
            CREATE EXTENSION IF NOT EXISTS "pgcrypto";
            
            CREATE TABLE "session" (
              "sid" varchar NOT NULL COLLATE "default",
                    "sess" json NOT NULL,
                    "expire" timestamp(6) NOT NULL
            )
            WITH (OIDS=FALSE);
            
            ALTER TABLE "session" ADD CONSTRAINT "session_pkey" 
            PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;
            `
        await pool.query(createTableText)

        // const newUser = {email: '1cuslugi.ru@gmail.com'}
        // create a settings
        // await pool.query('INSERT INTO settings(name,data) VALUES($1,$2)', ['usersAdmin',newUser])
        // const {rows} = await pool.query('SELECT * FROM settings')
        // return rows.length > 0 ? rows[0] : null
        // try {
        //     const res = await pool.query('SELECT * FROM test_json', null)
        //     return res.rows
        // } catch (e) {
        //     throw overrideError(e)
        // }
    },

    findOneOrCreate: async function ({name, data}) {
        // try {
        //     const {rows} = await pool.query('SELECT * FROM settings where name=$1', [name])
        //     if(rows.length > 0){
        //         return rows[0]
        //     } else if(data){//нужно создать новый и вернуть его
        //         const {rows:newRows } = await pool.query('INSERT INTO settings(name,data) VALUES($1,$2) RETURNING *' , [name,data])
        //         return newRows.length > 0 ? newRows[0]: null
        //     } else {
        //         return null
        //     }
        // }catch (e) {
        //     throw dbError(e)
        // }
    },
    getAll: async function () {
        try {
            return await pool.query(`SELECT * FROM session;`, null)
        } catch (e) {
            console.error(e.message)
            throw dbError(e)
        }
    },


}












