var Conversation = require("./../models/conversation");
var Message = require("./../models/message");
var config = require("../config");

exports.getDirectMessages = function (req, res, next) {
    console.log("chat params;", req.body);
    config.chatUser = req.body.to;
    Conversation.find({}).exec(function (response) {
        console.log(response);

    })
}