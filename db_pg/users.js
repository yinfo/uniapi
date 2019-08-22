const {Pool} = require('pg')
const dbError = require('./db_errors')
const connectionString = $storage.getConnectionStringPostgres()
const pool = new Pool({connectionString})

module.exports = {
//-------------------------------------------------------------------------------
//--------------------------- test_json ---------------------------------------
//-------------------------------------------------------------------------------
    createTable: async function () {
        const createTableText = `
            CREATE EXTENSION IF NOT EXISTS "pgcrypto";
            
            CREATE  TABLE IF NOT EXISTS orders (
                ID serial NOT NULL PRIMARY KEY,
                info json NOT NULL
            );
            `
        await pool.query(createTableText)
    },

    initialFill: async function () {
        const createTableText = `
        INSERT INTO orders (info)
        VALUES
           (
              '{ "customer": "Lily Bush", "items": {"product": "Diaper","qty": 24}}'
           ),
           (
              '{ "customer": "Josh William", "items": {"product": "Toy Car","qty": 1}}'
           ),
           (
              '{ "customer": "Mary Clark", "items": {"product": "Toy Train","qty": 2}}'
           ),
           (
              '{ "customer": "John Doe", "items": {"product": "Beer","qty": 6}}'
           );
            `
        await pool.query(createTableText)
    },

    findOneOrCreate: async function ({name, data}) {
        try {
            const {rows} = await pool.query('SELECT * FROM orders where name=$1', [name])
            if (rows.length > 0) {
                return rows[0]
            } else if (data) {//нужно создать новый и вернуть его

                const {rows} = await pool.query('INSERT INTO orders(name,data) VALUES($1,$2) RETURNING *', [name, data])
                return rows.length > 0 ? rows[0] : null
                // const {rows: newRows} = await pool.query('INSERT INTO orders(name,data) VALUES($1,$2) RETURNING *', [name, data])
                // return newRows.length > 0 ? newRows[0] : null
            } else {
                return null
            }
        } catch (e) {
            throw dbError(e)
        }
    },
    getAll: async function () {
        try {
            return await pool.query(`SELECT * FROM orders;`, null)
            // return await pool.query(`SELECT * FROM ${table}`, null)
        } catch (e) {
            console.error(e.message)
            throw dbError(e)
        }
    },

}


const overrideError = (e) => {
    const code = e.code
    const errorId = dbErrors[code] ? dbErrors[code] : 'unknown_db_error'
    return {
        code,
        errorId,
        message: e.message,
        stack: e.stack,
    }
}










