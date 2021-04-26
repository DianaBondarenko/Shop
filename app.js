const express = require('express');
const productsRouter = require('./routes/productsRouter.js');
const orderRouter = require('./routes/orderRouter.js');
const pool = require('./pool.js');
const productsRepo = require('./repos/products_repo.js')

// const app = express();
// const PORT = 3000;

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:false}));
const PORT = 3000;

app.use('/products', productsRouter);
app.use('/order', orderRouter);
// обработка ошибки 404
app.use((req, res, next)  => {
    res.status(404).send('Not Found');
});

pool.connect({
    user: 'postgres',
    host: 'localhost',
    database: 'shop',
    password: 'admin',
    port: 5432
})
    .then(()=> {
        app.listen(PORT, ()=>{
            console.log(`Server has started on port ${PORT}...`)
        })
    })
    .catch(er => {
        console.log(er);
    })




// app.listen(PORT, () => {
//     console.log(`Server has started on port ${PORT}...`)
// });