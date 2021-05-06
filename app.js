const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const productRouter = require('./routes/productRouter.js');
const orderRouter = require('./routes/orderRouter.js');
const pool = require('./models/pool.js');
const options = require('./optionsDB.js');
const morgan = require('morgan'); // console.log query info
const authMiddleWare = require('./common/middleware/authMiddleWare.js');
const authDTO = require('./common/middleware/authDTO.js');
const orderDTO = require('./common/middleware/orderDTO.js');
const validator = require('express-joi-validation').createValidator({});
const errorHandler = require('./common/middleware/errorHandler.js');
const NotFound = require("./common/errors/notFound.js");

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:false}));
const PORT = 3000;

app.use(morgan('dev'));
app.use('/products', productRouter);
app.use('/order', orderRouter);
app.use((req, res)  => {
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
