//const app = require('./app2.js');
const pool = require('./pool.js');
const express = require('express');

const app = express();
//app.use(express.json());
const PORT = 3000;

pool.connect({
    user: 'postgres',
    host: 'localhost',
    database: 'shop',
    password: 'admin',
    port: 5432
})
    .then(()=> {
        app.listen(3000, ()=>{
            console.log(`Server has started on port 3000...`)
        })
    })
    .catch(er => {
        console.log(er);
    })


