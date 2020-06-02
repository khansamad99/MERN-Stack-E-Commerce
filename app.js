const express = require('express');
const connectDB = require('./config/db');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const auth = require('./routes/auth');
const user = require('./routes/user');
const category = require('./routes/category');
const product = require('./routes/product');
const order = require('./routes/order');

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


app.use('/api',auth);
app.use('/api',user);
app.use('/api',category);
app.use('/api',product);
app.use('/api',order);

const PORT = process.env.PORT || 5000;
  
app.listen(PORT, () => {
    console.log(`App is running on ${PORT}`);
});