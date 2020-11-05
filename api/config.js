const mongoose = require('mongoose');


const connectDatabase = async() => {
    try {
        const conn = await mongoose.connect('mongodb://localhost/daykare', {
          useUnifiedTopology: true,
          useNewUrlParser: true,
          useCreateIndex: true,
        })
    
        console.log(`MongoDB Connected: ${conn.connection.host}`)
      } catch (error) {
        console.error(`Error: ${error.message}`)
        process.exit(1)
      }
}
module.exports = connectDatabase; 