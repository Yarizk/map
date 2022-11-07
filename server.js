//make server with express
const express = require('express');
const mongoose = require('mongoose');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 3000;
const userRoute = require('./routes/registerRoute');
const path = require('path')


//post
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

app.set('view engine', 'html');

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
app.use('/user', userRoute);

//listen
app.listen(port, () => console.log(`App listening on port ${port}!`));


