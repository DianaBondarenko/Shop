const express = require('express');
const productsRouter = require('./routes/productsRouter.js');
const orderRouter = require('./routes/orderRouter.js');

const app = express();
const PORT = 3000;

app.use('/products', productsRouter);
app.use('/order', orderRouter);
// обработка ошибки 404
app.use((req, res, next)  => {
    res.status(404).send('Not Found');
});

app.listen(PORT, () => {
    console.log(`Server has started on port ${PORT}...`)
});