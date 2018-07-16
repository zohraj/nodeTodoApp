var User = require("./../models/user");
exports.register = function (req, res, next) {
    var newUser = new User(req.body);
    var response = {}
    newUser.save()
        .then(user => {
            response={
                success:true,
                message:"User Registered Successfully",
                code: 2022,
                statusCode:200
            }
            res.status(response.statusCode).send(response);
        })
        .catch(err => {
            console.log(err);
            response={
                success:true,
                message:"User not registerd",
                code: 2023,
                statusCode:400
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
                if (user && user[0]) {


                    bcrypt.compare(params.password, user[0]._doc.password, function (err, isMatch) {

                        if (isMatch) {
                            userFound = true;
                            response = {
                                success: true,
                                message: 'Login',
                                code: 2020,
                                statusCode: 200
                            }
                        }


                    })
                }
                if (!userFound) {
                    response = {
                        success: true,
                        message: 'Incorrect username or password',
                        code: 2021,
                        statusCode: 200
                    }
                }
                res.status(response.statusCode).send(response);

            })
        }
    });

}
