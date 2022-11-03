//make server with express
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

//post
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//connect to mongodb
mongoose.connect('mongodb+srv://admin:admin123@cluster0.qinijsa.mongodb.net/test', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on('connected', () => {
    console.log('Mongoose is connected!!!!');
});

//cors
const cors = require('cors');
app.use(cors());

//routes
const routes = require('./routes/router');
app.use('/', routes);

//listen
app.listen(port, () => console.log(`App listening on port ${port}!`));


