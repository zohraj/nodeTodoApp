const mongoose = require('mongoose');
const db = {
    init: function () {
        mongoose.connect(encodeURI('mongodb://localhost:27017/custom')).then(conn => {
            console.log("connected with mongodb");
        }).catch(err => {
            console.log(err);
        })
    }
}
module.exports = db;