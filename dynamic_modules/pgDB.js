const {Pool} = require('pg')
const dbErrors = require('../models/db_errors')
const connectionString = $storage.getConnectionStringPostgres()
const pool = new Pool({connectionString})
// const uniqid = require('uniqid')

module.exports = {
//-------------------------------------------------------------------------------
//--------------------------- test_json ---------------------------------------
//-------------------------------------------------------------------------------
    testJsonGetAll: async function()  {
        try {
            const res = await pool.query('SELECT * FROM test_json', null)
            return res.rows
        } catch (e) {
            throw overrideError(e)
        }
    },
//-------------------------------------------------------------------------------
//---------------------------таблица Users---------------------------------------
//-------------------------------------------------------------------------------


    userGetById: async function(user_id)  {
        try {
            // const user_id = data
            const res = await pool.query('SELECT * FROM users where user_id=$1', [user_id])
            return res.rows.length > 0 ? res.rows[0] : null
        } catch (e) {
            throw overrideError(e)
        }
    },

    userGetAll: async function()  {
        try {
            const res = await pool.query('SELECT * FROM users', null)
            return res.rows
        } catch (e) {
            throw overrideError(e)
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







