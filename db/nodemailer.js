const nodemailer = require('nodemailer');
const options = require('./optionsEmail.js');

class Nodemailer {
    getHtml(user, order) {
        let orderInfo = order.map(el => `<tr><td>${el.order_id}</td><td>${el.product_id}</td><td>${el.name}</td>
            <td>${el.price}</td><td>${el.count}</td><td>${el.price_for_item}</td><td>${el.created_at}</td></tr>`).join(' ')
        const html =
            `<h2>User info: </h2>
             <table border="1" cellspacing="0" cellpadding="0">
                <tr>
                    <th> Name </th>
                    <th> Phone </th>
                    <th> Email </th>
            </tr>
            <tr>
                <td>${user.name}</td>
                <td>${user.phone}</td>
                <td>${user.email}</td>
            </tr>
         </table>
         <h2>Order info: </h2>
         <table border="1" cellspacing="0" cellpadding="0">
            <tr>
                <th>Oder_id</th>
                <th>Product_id</th>
                <th>Name</th>
                <th>Price</th>
                <th>Count</th>
                <th>Price for item</th>
                <th>Order_time</th>
            </tr>
            ${orderInfo}
        </table>
        <h2>Total price : ${order[0].total_price}</h2>`
        return html;
    }

    async sendMail(user, order) {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: options.user,
                pass: options.password,
            }
        });
        let mailOptions = {
            from: options.user,
            to: options.recipient,
            subject: 'Order from shop',
            text: 'Order info: ',
            html: this.getHtml(user, order)
        }

        transporter.sendMail(mailOptions, (err, data) => {
            if (err) {
                console.log('Mailing Error!: ', err);
            } else {
                console.log('Success')
            }
        })
    }
}

module.exports = new Nodemailer();