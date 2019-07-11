const table = 'json_test'
const {Pool} = require('pg')
const dbErrors = require('../models/db_errors')
const {connectionStringPostgres:connectionString} = require('../config/keys')
const pool = new Pool({connectionString})
// const uniqid = require('uniqid')

module.exports = {
//-------------------------------------------------------------------------------
//---------------------------Общие для всех модулей функции-----------------------------------------
//--------------------------------------------------------------------------------
    createTable: async function () {
        const createTableText = `            
            CREATE  TABLE IF NOT EXISTS ${table} (
              id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
              name  VARCHAR (50) UNIQUE,
              data JSONB
            );
            `
        try {
            return await pool.query(createTableText)
        } catch (e) {
            console.error(e.message)
            throw overrideError(e)
        }
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
    initialFill: async function () {
        const initialFillText = `
        INSERT INTO ${table} (data) VALUES 
          ('{}'),
          ('{"a": 1}'),
          ('{"a": 2, "b": ["c", "d"]}'),
          ('{"a": 1, "b": {"c": "d", "e": true}}'),
          ('{"b": 2}');
        `
        try {
            return await pool.query(initialFillText)
        } catch (e) {
            console.error(e.message)
            throw overrideError(e)
        }
    },
    deleteAll: async function()  {

    },
    getAll: async function()  {
        try {
            return await pool.query(`SELECT * FROM json_test WHERE data = '{"a":1}';`, null)
            // return await pool.query(`SELECT * FROM ${table}`, null)
        } catch (e) {
            console.error(e.message)
            throw overrideError(e)
        }
    },

//-------------------------------------------------------------------------------
//---------------------------Специфические модули-----------------------------------------
//--------------------------------------------------------------------------------


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
