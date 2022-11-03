//make server with express
const express = require('express');
const app = express();
const port = 3000;

//post
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//cors
const cors = require('cors');
app.use(cors());

//routes
const routes = require('./routes/router');
app.use('/', routes);

//listen
app.listen(port, () => console.log(`App listening on port ${port}!`));




// // Path: routes/index.js
// const express = require('express');
// const router = express.Router();
// const user = require('./user');

// router.use('/user', user);

// module.exports = router;

// // Path: routes/user.js
// const express = require('express');
// const router = express.Router();
// const userController = require('../controllers/user');

// router.post('/register', userController.register);
// router.post('/login', userController.login);

// module.exports = router;

// // Path: controllers/user.js
// const User = require('../models/user');
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');
// const salt = bcrypt.genSaltSync(10);

// class UserController {
//     static register(req, res) {
//         User.create({
//         username: req.body.username,
//         password: bcrypt.hashSync(req.body.password, salt)
//         })
//         .then(user => {
//             res.status(201).json({ user, message: 'Register success' });
//         })
//         .catch(err => {
//             res.status(500).json({ err, message: 'Register failed' });
//         });
//     }
    
//     static login(req, res) {
//         User.findOne({ username: req.body.username })
//         .then(user => {
//             if (user) {
//             if (bcrypt.compareSync(req.body.password, user.password)) {
//                 let token = jwt.sign({ id: user._id }, process.env.SECRET);
//                 res.status(200).json({ user, token, message: 'Login success' });
//             } else {
//                 res.status(500).json({ message: 'Wrong password' });
//             }
//             } else {
//             res.status(500).json({ message: 'User not found' });
//             }
//         })
//         .catch(err => {
//             res.status(500).json({ err, message: 'Login failed' });
//         });
//     }
//     }

// module.exports = UserController;

// // Path: models/user.js
// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// const userSchema = new Schema({
//     username: {
//         type: String,
//         required: [true, 'Username is required']
//     },
//     password: {
//         type: String,
//         required: [true, 'Password is required']
//     }
// });

// const User = mongoose.model('User', userSchema);

// module.exports = User;

// // Path: .env
// SECRET=secret

// // Path: .gitignore
// node_modules
// .env

