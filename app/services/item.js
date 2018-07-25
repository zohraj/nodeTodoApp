var Item = require("./../models/item");
var config = require("../config");
const jwt=require('jsonwebtoken')
exports.add = function (req, res, next) {
    var newItem = new Item(req.body);
    newItem.save()
        .then(item => {
            res.status(200).json("New item added");
        })
        .catch(err => {
            console.log(err);
            res.status(400).json("Unable to create new item");
        });
}
exports.list = function (req, res, next) {
    console.log("list view params:", req.params);
    var token = req.headers['x-access-token'];
    jwt.verify(token, config.secret, function (err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        // res.status(200).send(decoded);
        Item.find({ createdBy: req.params.id }, function (err, item) {
            if (err) res.status(400).send("Error:" + err);
            res.status(200).send(item);
        })
    });
   
}
exports.item = function (req, res, next) {
    Item.find({ _id: req.params.id }, function (err, item) {
        if (err) res.status(400).send("Error:" + err);
        res.status(200).send(item);
    })
}
exports.update = function (req, res, next) {

    Item.update(
        { _id: req.params.id },
        {
            $set: {
                'title': req.body.title,
                'description': req.body.description
            }
        },
        function (err) {
            if (!err) {
                res.status(200).json("Updated !");
            }
            else {
                res.status(200).json("Error");
            }
        });
}
exports.delete = function (req, res, next) {
    Item.remove({ _id: req.params.id }, function (err) {
        if (!err) {
            res.status(200).json("Deleted!");
        }
        else {
            res.status(200).json("Error");
            console.log(err);
        }
    });
}
