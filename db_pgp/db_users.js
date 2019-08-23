// const sql = require('../sql').users;
// const cs = {}; // Reusable ColumnSet objects.

module.exports = class Users  {
    constructor(
        db,
        // pgp,
    ) {
        this.db = db;
        // this.pgp = pgp;

        // set-up all ColumnSet objects, if needed:
        // createColumnsets(pgp);
    }

    // Creates the table;

    async all() {
        return this.db.any('SELECT * FROM users');
    }

    async create() {
        const createTableText = `
        CREATE TABLE users
        (
            id serial PRIMARY KEY,
            name text NOT NULL
        )
        `;
        return this.db.none(createTableText);
    }

    // Initializes the table with some user records, and return their id-s;
    async init() {
        // return this.db.map(sql.init, [], row => row.id);
    }

    // Drops the table;
    async drop() {
        // return this.db.none(sql.drop);
    }

    // Removes all records from the table;
    async empty() {
        // return this.db.none(sql.empty);
    }

    // Adds a new user, and returns the new object;
    async add(name) {
        // return this.db.one(sql.add, name);
    }

    // Tries to delete a user by id, and returns the number of records deleted;
    async remove(id) {
        return this.db.result('DELETE FROM users WHERE id = $1', +id, r => r.rowCount);
    }

    // Tries to find a user from id;
    async findById(id) {
        return this.db.oneOrNone('SELECT * FROM users WHERE id = $1', +id);
    }

    // Tries to find a user from name;
    async findByName(name) {
        return this.db.oneOrNone('SELECT * FROM users WHERE name = $1', name);
    }



    // Returns the total number of users;
    async total() {
        return this.db.one('SELECT count(*) FROM users', [], a => +a.count);
    }
}

//////////////////////////////////////////////////////////
// Example of statically initializing ColumnSet objects:

// function createColumnsets(pgp) {
//     // create all ColumnSet objects only once:
//     if (!cs.insert) {
//         // Type TableName is useful when schema isn't default "public" ,
//         // otherwise you can just pass in a string for the table name.
//         const table = new pgp.helpers.TableName({table: 'users', schema: 'public'});
//
//         cs.insert = new pgp.helpers.ColumnSet(['name'], {table});
//         cs.update = cs.insert.extend(['?id']);
//     }
//     return cs;
// }


