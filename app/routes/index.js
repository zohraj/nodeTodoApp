var express = require('express');
var router = express.Router();

var UserService = require('./../services/user');
var ItemService = require('./../services/item');
var chat_service = require('./../services/chat');
var ChatService = require('./../services/conversation');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });

});


router.get('/list/:id', ItemService.list);
router.post('/add', ItemService.add);
router.put('/update/:id', ItemService.update);
router.get('/item/:id', ItemService.item);
router.delete('/delete/:id', ItemService.delete);
router.post('/register', UserService.register);
router.post('/login', UserService.login);
router.get("/users", UserService.getAllUsers)
// router.post("/chat", chat_service.getDirectMessages)



// Retrieve single conversation
router.get("/chat/:converstationId", ChatService.getConversation)
// Start new conversation
router.post("/chat/new/:recipient", ChatService.newConversation)
// Send reply in conversation
router.post("chat/:conversationId", ChatService.sendReply)



module.exports = router;
