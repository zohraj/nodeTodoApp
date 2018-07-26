var config = require('../config');
const bcrypt = require('bcrypt-nodejs');
var User = require("./../models/user");
const jwt = require('jsonwebtoken');
exports.register = function (req, res, next) {
    var newUser = new User(req.body);
    var response = {}
    newUser.save()
        .then(user => {
            response = {
                success: true,
                data: newUser,
                message: "User Registered Successfully",
                code: 2022,
                statusCode: 200
            }
            res.status(response.statusCode).send(response);
        })
        .catch(err => {
            console.log(err);
            response = {
                success: true,
                message: "User not registerd",
                code: 2023,
                statusCode: 400
            }
            res.status(response.statusCode).send(response);
        });
}
exports.login = function (req, res, next) {
    var params = req.body;
    var response = {}
    req.checkBody("password", "Please Enter Password.").notEmpty();
    req.checkBody("username", "Please Enter Username.").notEmpty();
    req.getValidationResult().then((validationResult) => {
        if (!validationResult.isEmpty()) {
            // res.json(validationResult.array());
        }
        else {
            var userFound = false;
            User.find({ username: params.username }, 'password').exec(function (err, user) {
                // if (err) return handleError(err);
                response = {
                    success: true,
                    message: 'Incorrect username or password',
                    code: 2021,
                    statusCode: 200
                }
                if (user && user[0]) {
                    bcrypt.compare(params.password, user[0]._doc.password, function (err, isMatch) {
                        if (isMatch) {
                            userFound = true;
                            var token = jwt.sign({ id: user[0]._doc._id }, config.secret, {
                                // expiresInMinutes: 1440 // expires in 24 hours
                            });

                            user[0]._doc.token = token;
                            response = {
                                success: true,
                                data: user[0]._doc,
                                message: 'Login',
                                code: 2020,
                                statusCode: 200,

                            }
                        }
                        res.status(response.statusCode).send(response);


                    })
                }
                else {
                    res.status(response.statusCode).send(response);
                }



            })
        }
    });

}
exports.getAllUsers = function (req, res, next) {
    var token = req.headers['x-access-token'];
    jwt.verify(token, config.secret, function (err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        User.find({}, ).exec(function (err, users) {
            // if (err) return handleError(err);

            if (err) res.status(400).send("Error:" + err);
            var response = {
                success: true,
                message: 'success',
                data: users,
                code: 2025,
                statusCode: 200
            }
            res.status(200).send(response);
        });

    });
}

