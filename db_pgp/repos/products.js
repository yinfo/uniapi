const sql = require('../sql').products;

const cs = {}; // Reusable ColumnSet objects.

/*
 This repository mixes hard-coded and dynamic SQL, primarily to show a diverse example of using both.
 */

class ProductsRepository {
    constructor(db, pgp) {
        this.db = db;
        this.pgp = pgp;

        // set-up all ColumnSet objects, if needed:
        createColumnsets(pgp);
    }

    // Creates the table;
    async create() {
        return this.db.none(sql.create);
    }

    // Drops the table;
    async drop() {
        return this.db.none(sql.drop);
    }

    // Removes all records from the table;
    async empty() {
        return this.db.none(sql.empty);
    }

    // Adds a new record and returns the full object;
    // It is also an example of mapping HTTP requests into query parameters;
    async add(values) {
        return this.db.one(sql.add, {
            userId: +values.userId,
            productName: values.name
        });
    }

    // Tries to delete a product by id, and returns the number of records deleted;
    async remove(id) {
        return this.db.result('DELETE FROM products WHERE id = $1', +id, r => r.rowCount);
    }

    // Tries to find a user product from user id + product name;
    async find(values) {
        return this.db.oneOrNone(sql.find, {
            userId: +values.userId,
            productName: values.name
        });
    }

    // Returns all product records;
    async all() {
        return this.db.any('SELECT * FROM products');
    }

    // Returns the total number of products;
    async total() {
        return this.db.one('SELECT count(*) FROM products', [], a => +a.count);
    }
}

//////////////////////////////////////////////////////////
// Example of statically initializing ColumnSet objects:

function createColumnsets(pgp) {
    // create all ColumnSet objects only once:
    if (!cs.insert) {
        // Type TableName is useful when schema isn't default "public" ,
        // otherwise you can just pass in a string for the table name.
        const table = new pgp.helpers.TableName({table: 'products', schema: 'public'});

        cs.insert = new pgp.helpers.ColumnSet(['name'], {table});
        cs.update = cs.insert.extend(['?id', '?user_id']);
    }
    return cs;
}

module.exports = ProductsRepository;
