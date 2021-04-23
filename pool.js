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
    ////////////////// security issue
    query(sql) {
        return this._pool.query(sql);
    }
}

module.exports = new Pool();