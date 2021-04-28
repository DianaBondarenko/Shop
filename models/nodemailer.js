const nodemailer = require('nodemailer')

class Nodemailer {
    setHtml(user, order) {
        let orderInfo = order.map(el => `<tr><td>${el.order_id}</td><td>${el.product_id}</td><td>${el.name}</td>
            <td>${el.price}</td><td>${el.count}</td><td>${el.price_for_item}</td><td>${el.created_at}</td></tr>`).join(' ')
        const html =
            `<h2>User info: </h2>
             <table border="1" cellspacing="0" cellpadding="0">
                <tr>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Email</th>
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
                user: 'ivanrumun759@gmail.com',
                pass: '12ivan34',
            }
        });
        let mailOptions = {
            from: 'ivanrumun759@gmail.com',
            to: 'dianabondarenko17@gmail.com',
            subject: 'Order from shop',
            text: 'Order info: ',
            html: this.setHtml(user, order)
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

//${total_price}
module.exports = new Nodemailer();


//`<p>User info: </p>
//          <table border="1" cellspacing="1" cellpadding="0">
//             <tr>
//                 <td>Name</td>
//                 <td>Phone</td>
//                 <td>Email</td>
//             </tr>
//             <tr>
//                 <td>Name</td>
//                 <td>Phone</td>
//                 <td>Email</td>
//             </tr>
//          </table>
//          <p>Order info: </p>
//          <table border="1" cellspacing="1" cellpadding="0">
//             <tr>
//             <td>Oder_id</td>
//             <td>Product_id</td>
//             <td>Name</td>
//             <td>Amount</td>
//             <td>Price</td>
//             <td>Order_time</td>
//             </tr>
//         </table>
//         <p>Total price : 500</p>`