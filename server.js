const express =  require('express');
const cors = require('cors');
const userRoutes = require('./api/routes/user');
const connectDatabase = require('./api/config');
const paypal = require('paypal-rest-sdk');

const port = process.env.port || 8000;

const app = express();
connectDatabase();
app.use(express.json());
app.use(cors())

//routes go here
app.use('/users',userRoutes);

paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'AaU8tQfmz1_MFDTKuf84yYERXvdDt2ZFJVrxhNW_49DazF4A_F0VBuKyV5_nntyEdZqUa5Oq9ZBj65GV',
    'client_secret': 'EAZ8aFDU4lHHLy1bQqULYWqznf3dBknXZW3AH__zFC0bUs8AGUyR6RNbm-jHvqtikX7PsSqMO5vxuvKm'
  });
  app.post('/pay', (req, res) => {
    const create_payment_json = {
      "intent": "sale",
      "payer": {
          "payment_method": "paypal"
      },
      "redirect_urls": {
          "return_url": "http://localhost:8000/success",
          "cancel_url": "http://localhost:8000/cancel"
      },
      "transactions": [{
          "item_list": {
              "items": [{
                  "name": "Red Sox Hat",
                  "sku": "001",
                  "price": "25.00",
                  "currency": "USD",
                  "quantity": 1
              }]
          },
          "amount": {
              "currency": "USD",
              "total": "25.00"
          },
          "description": "Hat for the best team ever"
      }]
  };
  
  paypal.payment.create(create_payment_json, function (error, payment) {
    if (error) {
        throw error;
    } else {
        for(let i = 0;i < payment.links.length;i++){
          if(payment.links[i].rel === 'approval_url'){
            res.redirect(payment.links[i].href);
          }
        }
    }
  });
  
  });
  
  app.get('/success', (req, res) => {
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;
  
    const execute_payment_json = {
      "payer_id": payerId,
      "transactions": [{
          "amount": {
              "currency": "USD",
              "total": "25.00"
          }
      }]
    };
  
    paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
      if (error) {
          console.log(error.response);
          throw error;
      } else {
          console.log(JSON.stringify(payment));
          res.send('Success');
      }
  });
  });
  
  app.get('/cancel', (req, res) => res.send('Cancelled'));
    

//handling error gracefully
app.use((req,res,next) => {
    const error = new Error('not found');
    error.status = 404;
    next(error);
  });
  app.use((error,req,res,next) => {
   res.status(error.status || 500).json({
        error:{
            message:error.message
        }
   });
  })
  

app.listen(port,() => {
    console.log(` the server is running on port ${port}`);
})
