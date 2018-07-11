

var User = require("./../models/user");
var bcrypt = require('bcrypt-nodejs');
exports.register = function (req, res, next) {
    var newUser = new User({
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    });
    newUser.save()
        .then(item => {
            res.send("item saved to database");
        })
        .catch(err => {
            console.log(err);
            res.status(400).send("unable to save to database");
        });
}
exports.login = function (req, res, next) {
    console.log("login");
    var params = req.body;

    req.checkBody("password", "Please Enter Password.").notEmpty();
    req.checkBody("username", "Please Enter Username.").notEmpty();
    req.getValidationResult().then((validationResult) => {
        if (!validationResult.isEmpty()) {
            res.json(validationResult.array());
        }
        else {
            User.find({ username: params.username }, 'password').exec(function (err, user) {
                bcrypt.compare(params.password, user[0]._doc.password, function (err, isMatch) {
                    if (err) {
                        res.status(500).send("Something went wrong. Please try again later.");
                    }
                    else {
                        if (isMatch) {
                            req.session.user = true;
                            res.status(200).send("Yayyy Logged in");
                        }
                        else {
                            res.status(401).send("Password is incorrect")
                        }
                    }
                })
                if (err) return handleError(err);
                console.log(user);
            })
        }
    });

}
