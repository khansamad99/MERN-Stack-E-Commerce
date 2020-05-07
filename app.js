const express = require('express');
const connectDB = require('./config/db');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const register = require('./routes/users');

const app = express();

//DB Connection
connectDB();
app.get('/', (req, res) => {
    res.send('Hello');
  });

  //Middlewares
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());


app.use('/auth',register);
const PORT = process.env.PORT || 5000;
  
app.listen(PORT, () => {
    console.log(`App is running on ${PORT}`);
});