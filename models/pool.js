const pg = require('pg');
// const pool = new pg.Pool({
//     user: 'postgres',
//     host: 'localhost',
//     database: 'shop',
//     password: 'admin',
//     port: 5432
// })
// module.exports = pool;
class Pool {
    _pool = null;
    connect(options) {
        this._pool = new pg.Pool(options);
        return this._pool.query('SELECT 1+1');
    }
    close(){
        this._pool.end();
    }

    query(sql, params) {
        return this._pool.query(sql, params);
    }
}

module.exports = new Pool();