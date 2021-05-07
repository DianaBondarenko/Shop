const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const db = require('./dbSequelize.js');
const productRouter = require('./routes/productRouter.js');
const orderRouter = require('./routes/orderRouter.js');
const pool = require('./models/pool.js');
const options = JSON.parse(process.env.DB_OPTIONS);  //require('./optionsDB.js');
const morgan = require('morgan'); // console.log query info
const errorHandler = require('./common/middleware/errorHandler.js');
const NotFound = require("./common/errors/notFound.js");

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:false}));
const PORT = process.env.PORT;

db.authenticate()
    .then(() => {console.log('DB connected...')})
    .catch(er => console.log('Error: ', er));

app.use(morgan('dev'));
app.use('/products', productRouter);
app.use('/order', orderRouter);
app.use((req, res) => {
    throw new NotFound('Not found')
});
app.use(errorHandler);

pool.connect(options)
    .then(()=> {
        app.listen(PORT, ()=>{
            console.log(`Server has started on port ${PORT}...`)
        })
    })
    .catch(er => {
        console.log(er);
    })
