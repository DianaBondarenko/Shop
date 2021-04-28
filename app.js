const express = require('express');
const productRouter = require('./routes/productRouter.js');
const orderRouter = require('./routes/orderRouter.js');
const pool = require('./models/pool.js');
const nodeMailer = require('./models/nodemailer');

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:false}));
const PORT = 3000;

app.use('/products', productRouter);
app.use('/order', orderRouter);
// app.use('/mail', (req, res) => {
//     console.log('mailing');
//     try {
//         nodeMailer.sendMail(res,{})
//     }
//     catch (e) {
//         console.log(e)
//     }
//     console.log('sent');
//     //res.send('sent');
// });
app.use((req, res)  => {
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