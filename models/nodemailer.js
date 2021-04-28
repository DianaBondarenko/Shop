const nodemailer = require('nodemailer')

// sendMail(transporter, name, phone, email, products){
//
// }

//let testEmailAccount = await nodemailer.createTestAccount()
class Nodemailer{
    setHtml()
    async sendMail(inf) {
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
            html:
                `<p>User info: </p>
         <table border="1" cellspacing="1" cellpadding="0">
            <tr>
                <td>Name</td>
                <td>Phone</td>
                <td>Email</td>
            </tr>
            <tr>
                <td>Name</td>
                <td>Phone</td>
                <td>Email</td>
            </tr>
         </table>
         <p>Order info: </p>
         <table border="1" cellspacing="1" cellpadding="0">
            <tr>
            <td>Oder_id</td>
            <td>Product_id</td>
            <td>Name</td>
            <td>Amount</td>
            <td>Units</td>
            <td>Price</td>
            <td>Order_time</td>
            </tr>
        </table>
        <p>Total price : 500</p>`
        }

        transporter.sendMail(mailOptions, (err, data) => {
            if (err) {
                console.log('Mailing Error!: ',err);
            } else {
                console.log('Success')
            }
        })

    }
}

//${total_price}
module.exports = new Nodemailer();