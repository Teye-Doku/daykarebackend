const express =  require('express');
const cors = require('cors');
const userRoutes = require('./api/routes/user');
const connectDatabase = require('./api/config');

const port = process.env.port || 8000;

const app = express();
connectDatabase();
app.use(express.json());
app.use(cors())

//routes go here
app.use('/users',userRoutes);

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
