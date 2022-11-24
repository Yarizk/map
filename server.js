//make server with express
const express = require('express');
const mongoose = require('mongoose');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 3000;
const userRoute = require('./routes/registerRoute');
const cookieParser = require("cookie-parser");



//post
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

app.set('view engine', 'ejs');
app.use(express.static('public'));


//connect to mongodb
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on('connected', () => {
    console.log('Mongoose is connected!!!!');
});

//cors
const cors = require('cors');
app.use(cors());

//routes
const routes = require('./routes/router');
app.use('/', routes);
app.use('/', userRoute);

//listen
app.listen(port, () => console.log(`App listening on port ${port}!`));


