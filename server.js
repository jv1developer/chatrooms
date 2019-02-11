const express = require('express');
const app = express();
// app.use(express.static(__dirname + "/public"));

// Initialize views folders and EJs files:
app.set('views', __dirname + '/views'); 
app.set('view engine', 'ejs');

// Initialize session:
var session = require('express-session');
app.use(session({
  secret: 'keyboardkitteh',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }
}))

// Socket Server Listen:
const server = app.listen(1337);
const io = require('socket.io')(server);
var counter = 0;

// Receive index's message and console-logs it:
io.on('connection', function (socket) { //2
  io.emit('greeting', { msg: 'Greetings, from server Node, brought to you by Sockets! -Server' }); //3
  socket.on('thankyou', function (data) { //7
    console.log(data.msg); //8 (note: this log will be on your server's terminal)
  });

  // if (session.count >= 0) {
  //   session.count = -1;
  //   session.count = session.count + 1;
  //   var countValue = session.count;
  // }
  // else {
  //   session.count = -1;
  //   session.count = session.count + 1;
  //   var countValue = session.count;
  // }

  socket.on('clickReset', function (data) {
    countValue = 0;
    io.emit('countZero', { msg: countValue});
  });

  socket.on('clickGreen', function (data) {
    color = 'green';
    io.emit('display', { msg: color});
  });

  socket.on('clickBlue', function (data) {
    color = 'blue';
    io.emit('display', { msg: color});
  });

  socket.on('clickPink', function (data) {
    color = 'pink';
    io.emit('display', { msg: color});
  });
  
  var chatArr = ["Chatroom activated"];
  socket.on('clickMessage', function (data) {
    console.log(data.msg);
    chatArr.push('Added');
    chatArr.push(data.msg);
    postedMessage = chatArr;
    io.emit('messagePosted', { msg: postedMessage});
    // return postedMessage;
    console.log (chatArr);
  });

  socket.on('startMessage', function (data) {
    console.log('++++++++++++++++++++');
    console.log(data.msg);
    var allMessage;
    allMessage = data.msg+" has entered the chatroom.";
    io.emit('startPosted', {msg: allMessage});
  });

  // socket.on('clickExit', function (data) {
  //   console.log(data.msg);
  //   var allExit = data.msg;
  //   io.emit('exitMessage', {msg: allExit});
  // });

  console.log('****************');
  // console.log(chatArr);

  // socket.on('forEveryone', function (data) {
  //   var everyMessage = allMessage;
  //   io.emit('postEveryone', {msg: everyMessage});
  // })

});

// Appends exit message when a user exits the chatroom:

var allClients = [];
io.sockets.on('connection', function(socket) {
   allClients.push(socket);

   socket.on('disconnect', function() {
      console.log('Got disconnect!');
      io.emit('userExit', {msg: "A user exited the chatroom."});
      var i = allClients.indexOf(socket);
      allClients.splice(i, 1);
   });
});

// Initialize bodyParser to make use of "params" later:
var bodyParser = require('body-parser');
// use it!
app.use(bodyParser.urlencoded({extended: true}));

// Setup the root route to run the "index.ejs" file from "views" folder:
app.get('/', function (req, res){
  res.render('index');
});