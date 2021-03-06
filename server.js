
//TODO: fix line 69 with content  "if(rows.username != usernameToLookup)". It doesn't work. I want to check if the username exists.


// Prerequisites - first run:
//   npm install express
//   npm install body-parser
//   npm install sqlite3
//   npm install socket




//TODO: make emails unique (currently only usernnames are unique)
var port= 1111;
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

server.listen(port);
console.log('Server started at http://localhost:%s/', port);


app.get('/message.html', function (req, res) {
  res.sendfile(__dirname + '/site_files/message.html')
 console.log("hey");
});

var usernames = {};

io.sockets.on('connection', function (socket) {

  // when the client emits 'sendchat', this listens and executes
  socket.on('sendchat', function (data) {
    // we tell the client to execute 'updatechat' with 2 parameters
    io.sockets.emit('updatechat', socket.username, data);
  });

  // when the client emits 'adduser', this listens and executes
  socket.on('adduser', function(username){
    // we store the username in the socket session for this client
    socket.username = username;
    // add the client's username to the global list
    usernames[username] = username;
    // echo to client they've connected
   socket.emit('updatechat', 'Server', 'you have connected');
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('updatechat', 'Server', username + ' has connected');
    // update the list of users in chat, client-side
    io.sockets.emit('updateusers', usernames);
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', function(){
    // remove the username from global usernames list
    delete usernames[socket.username];
    // update list of users in chat, client-side
    io.sockets.emit('updateusers', usernames);
    // echo globally that this client has left
    socket.broadcast.emit('updatechat', 'Server', socket.username + ' has disconnected');
  });
});

// required to support parsing of POST request bodies
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.use(express.static('site_files'));

var fs = require("fs");
var file = "users.db";
var exists = fs.existsSync(file);

var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database(file);

db.serialize(function() {
  if(!exists){
    db.run("CREATE TABLE users (email TEXT, password TEXT, username TEXT, firstname TEXT, activities TEXT, gender TEXT,genderpartner TEXT, intensity TEXT,monday TEXT, tuesday TEXT, wednesday TEXT, thursday TEXT, friday TEXT, saturday TEXT, sunday TEXT,highest TEXT, spotting TEXT,runtime TEXT, runloc TEXT, cardioact TEXT, cardiopartner TEXT, cardiotime TEXT,basketexp TEXT, basketpartexp TEXT, soccerexp TEXT, soccerpartexp TEXT, tennisexp TEXT, tennispartexp TEXT, badmintonexp TEXT, badmintonpartexp TEXT, squashexp TEXT, squashpartexp TEXT, swimtime TEXT, swimrace TEXT, classpart TEXT, classexp TEXT, classpartexp TEXT)");

  }
});


app.use(express.static('site_files'));

// CREATE a new user
app.post('/users', function (req, res) {
  var postBody = req.body;
  var email = postBody.email;
  var username = postBody.username;
  var password = postBody.password;
  var first = postBody.firstname;
 // var last = postBody.lastname;


  // musttext fill in all slots
  if (!username) {
    res.send("Error: Username is undefined.");

    return; // return early!
  }
  else if (!password) {
    res.send("Error: Password is undefined.");

    return; // return early!
  }
  else if (!first) {
    res.send("Error: First Name is undefined.");

    return; // return early!
  }
  else if (!email) {
    res.send("Error: Email is undefined.");

    return; // return early!
  }
  // oh god why?! It's huge but it works! No touchie!
  db.run("INSERT INTO users VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", email, password, username, first, "" ,"", "","","","","","","","","","","","","","", "","","","","","","","","","","","","","","","","",function(err,result)
  {
   if (err)
   {res.send('error');}
      else
   {res.send('OK');}
       
  });

  
});
///logging in
app.post('/dashboard/*', function (req, res) {
  var postBody = req.body;
  var usernameToLookup = postBody.username;
  var givenPassword = postBody.password;
    db.each("SELECT * FROM users WHERE username = \"" + usernameToLookup + "\"", function(err, rows){
      if(rows.username != usernameToLookup){ 
        console.log("No user with that username was found.");
        res.send('error');
        return;
      }else if(rows.password == givenPassword){
        console.log("Hello, " + rows.username);
        console.log("password matched, sending");
        res.send('OK');
        return;
      }
      else{
        console.log("Password incorrect");
        res.send('error');
        return;
      }
    });
  });


//survey database from hell
app.put('/survey/', function (req, res) {
  var postBody = req.body;
  var username = postBody.username;
   var activities = postBody.activities;
    var gender = postBody.gender;
   var genderpartner = postBody.genderpartner;
   var intensity = postBody.intensity;
   var monday = postBody.monday;
   var tuesday = postBody.tuesday;
   var wednesday = postBody.wednesday;
   var thursday = postBody.thursday;
   var friday = postBody.friday;
   var saturday = postBody.saturday;
   var sunday = postBody.sunday;
    var highest = postBody.highest;
    var spotting = postBody.spotting;
    var runtime = postBody.runtime;
    var runloc = postBody.runloc;
    var cardioact = postBody.cardioact;
    var cardiopartner = postBody.cardiopartner;
    var cardiotime = postBody.cardiotime;
   var basketexp = postBody.basketexp;
    var basketpartexp = postBody.basketpartexp;
    var soccerexp = postBody.soccerexp;
    var soccerpartexp = postBody.soccerpartexp;
    var tennisexp = postBody.tennisexp;
   var tennispartexp = postBody.tennispartexp;
   var badmintonexp = postBody.badmintonexp;
  var badmintonpartexp = postBody.badmintonpartexp;
  var squashexp = postBody.squashexp;
   var squashpartexp = postBody.squashpartexp;
   var swimtime = postBody.swimtime;
   var swimrace = postBody.swimrace;
 var classpart = postBody.classpart;
   var classexp = postBody.classexp;
  var classpartexp = postBody.classpartexp;

    db.run("UPDATE users SET activities = \"" + activities + "\",gender = \"" + gender + "\", genderpartner = \"" + genderpartner + "\", intensity= \"" + intensity + "\", monday= \"" + monday + "\", tuesday= \"" + tuesday + "\", wednesday= \"" + wednesday + "\", thursday= \"" + thursday + "\", friday= \"" + friday + "\", saturday= \"" + saturday + "\", sunday= \"" + sunday + "\",  highest= \"" + highest + "\",  spotting= \"" + spotting + "\",  runtime= \"" + runtime + "\",  runloc= \"" + runloc+ "\", cardioact= \"" + cardioact + "\", cardiopartner= \"" + cardiopartner + "\",  cardiotime= \"" + cardiotime + "\",  basketexp= \"" + basketexp + "\",  basketpartexp= \"" + basketpartexp + "\",  soccerexp= \"" + soccerexp + "\", soccerpartexp= \"" + soccerpartexp + "\", tennisexp= \"" + tennisexp + "\", tennispartexp= \"" + tennispartexp + "\", badmintonexp= \"" + badmintonexp + "\", badmintonpartexp= \"" + badmintonpartexp + "\", squashexp= \"" + squashexp + "\", squashpartexp= \"" + squashpartexp + "\", swimtime= \"" + swimtime + "\", swimrace= \"" + swimrace + "\", classpart= \"" + classpart + "\", classexp= \"" + classexp + "\", classpartexp= \"" + classpartexp + "\" WHERE username = \"" + username + "\"", function(err,result)

 {
    console.log("wrote: " + username);
   });
   });

app.post('/matches/', function (req, res) {
  var postBody = req.body;
 // &&SELECT activities FROM users WHERE username!='"+username+"'
 var username=postBody.username;
 var nonuserInfo = [];
db.each("SELECT * FROM users WHERE username = '"+username+"'", function(err, rows){
    if(!rows){
      res.send("error, no user");
      return;
    }else{
      var activitiesArray = rows.activities.split(',');
       var intensity = intensity= rows.intensity;
         var mondayArray=rows.monday.split(',');
         var tuesdayArray=rows.tuesday.split(','); 
         var wednesdayArray=rows.wednesday.split(',');
         var thursdayArray=rows.thursday.split(',');
         var fridayArray=rows.friday.split(',');
         var saturdayArray=rows.saturday.split(',');
         var sundayArray=rows.sunday.split(',');
         console.log(activitiesArray);
         
      db.each("SELECT username, activities, monday, tuesday, wednesday, thursday, friday, saturday, sunday FROM users WHERE username!='"+username+"'", function(err, rowstwo){
    if(!rowstwo){
      console.log("nothin");
      res.send("error");
      return;
    }else{
      nonuserInfo.push(rowstwo);
    }
    },
  function(err, comp){
     console.log(comp);  //comp = activitiesArray
    var usernamesArray=[];
    var sameActivities=[];
    var sameMonday=[];
    var sameTuesday=[];
    var sameWednesday=[];
    var sameThursday=[];
    var sameFriday=[];
    var sameSaturday=[];
    var sameSunday=[];
    //if any of the users share an activity with the loggedIn user, push that user's username into usernamesArray (these are the loggedIn user's matches)
    for(var y = 0; y<nonuserInfo.length; y++)
    {
      var nonuseractivitiesarray = nonuserInfo[y].activities.split(',');
      var nonusermonday = nonuserInfo[y].monday.split(',');
      var nonusertuesday = nonuserInfo[y].tuesday.split(',');
      var nonuserwednesday = nonuserInfo[y].wednesday.split(',');
      var nonuserthursday = nonuserInfo[y].thursday.split(',');
      var nonuserfriday = nonuserInfo[y].friday.split(',');
      var nonusersaturday = nonuserInfo[y].saturday.split(',');
      var nonusersunday = nonuserInfo[y].sunday.split(',');

      if((compareArray(nonuseractivitiesarray, activitiesArray)=="yes")&&(compareArray(nonusermonday, mondayArray)=="yes"||compareArray(nonusertuesday, tuesdayArray)=="yes"||compareArray(nonuserwednesday, wednesdayArray)=="yes"||compareArray(nonuserthursday, thursdayArray)=="yes"||compareArray(nonuserfriday, fridayArray)=="yes"||compareArray(nonusersaturday, saturdayArray)=="yes")||compareArray(nonusersunday, sundayArray)=="yes"){
        usernamesArray.push(nonuserInfo[y].username);
        sameActivities.push(findSame(nonuseractivitiesarray, activitiesArray));
        sameMonday.push(findSame(nonusermonday, mondayArray));
        sameTuesday.push(findSame(nonusertuesday, tuesdayArray));
        sameWednesday.push(findSame(nonuserwednesday, wednesdayArray));
        sameThursday.push(findSame(nonuserthursday, thursdayArray));
        sameFriday.push(findSame(nonuserfriday, fridayArray));
        sameSaturday.push(findSame(nonusersaturday, saturdayArray));
        sameSunday.push(findSame(nonusersunday, sundayArray));
      }
    }
   
  console.log('sending from server');
  res.send({usernames: usernamesArray, activities: sameActivities, monday:sameMonday, tuesday:sameTuesday, wednesday:sameWednesday, thursday:sameThursday, friday:sameFriday, saturday:sameSaturday, sunday:sameSunday});
  });
   } 
  });

//do the two arrays share a number in common
function compareArray(arrOne, arrTwo)
{
  
 for(var i = 0; i<arrOne.length; i++)
  for(var j = 0; j<arrTwo.length; j++)
  {
    if(arrOne[i]==arrTwo[j])
      return "yes";
  }
return "no";
}

function findSame(arrOne, arrTwo)
{
  var same="";
 for(var i = 0; i<arrOne.length; i++)
  for(var j = 0; j<arrTwo.length; j++)
  {
    if(arrOne[i]==arrTwo[j]){
      if(same=="")
      same = same + arrOne[i];
    else
       same = same +", "+ arrOne[i];
    }
  }

return same;
}

});



// start the server on http://localhost:1111/
//var server = app.listen(1111, function () {
  //var port = server.address().port;
  //console.log('Server started at http://localhost:%s/', port);
//});

