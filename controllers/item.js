var Item = require("./../models/item");
exports.add = function (req, res, next) {
    var newItem = new Item(req.body);
    newItem.save()
        .then(item => {
            console.log("----Added");
            res.send("item saved to database");
        })
        .catch(err => {
            console.log("---Catched")
            console.log(err);
            res.status(400).send("unable to save to database");
        });
}
exports.list = function (req, res, next) {
    console.log("retrieving list");
    Item.find({}, 'title', function (err, item) {
        if (err) res.status(400).send("Error:" + err);
        res.status(200).send(item);
    })
}
exports.update = function (req, res, next) {
    
    Item.update(
        { _id: req.params.id },
        { $set: { 'title': req.body.title } },
        function (err) {
            if (!err) {
                res.status(200).send("Updated !");
            }
            else {
                res.status(200).send("Error");
            }
        });
}
exports.delete = function (req, res, next) {
    Item.remove({ _id: req.params.id }, function (err) {
        if (!err) {
            res.status(200).send("Deleted!");
        }
        else {
            res.status(200).send("Error");
            console.log(err);
        }
    });
}
