var express = require('express'),
    bodyParser = require('body-parser'),
    unirest = require('unirest'),
    events = require('events'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    env = require('dotenv').config(),
    webpush = require('web-push'),
    urlsafeBase64 = require('urlsafe-base64'),
    jsonDB = require('node-json-db');



var app = express();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
app.set('trust proxy', 1); // trust first proxy 
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));
app.use(express.static(__dirname + '/public'));

var db = new jsonDB("../db/db.json", true, true);
// db.push("/test1","super test");
// db.push("/test2/my/test",5);
// db.push("/test3", {test:"test", json: {test:["test"]}});
// db.push("/test3", {new:"cool", json: {important : 5}}, false);
// var data = db.getData("/");
// console.log('data', data);

// db.delete("/test1");

// db.push("/arraytest/myarray[0]", {obj:'test'}, true);
// // var testString = db.getData("/arraytest/myarray[0]/obj");
// db.delete("/arraytest/myarray[0]");
// db.push("/arraytest/myarray[]", {
//     obj:'test'
// }, true);
// db.push("/arraytest/lastItemArray", [1, 2, 3], true);
// var value = db.getData("/arraytest/lastItemArray[-1]");
// console.log('db value', value);
// db.delete("/arraytest/lastItemArray[-1]");
// value = db.getData("/arraytest/lastItemArray[-1]");
// console.log('db value', value);



const vapidKeys = webpush.generateVAPIDKeys();
console.log('vapidKeys public', vapidKeys.publicKey);
console.log('vapidKeys private', vapidKeys.privateKey);
const decodedVapidPublicKey = urlsafeBase64.decode(vapidKeys.publicKey);

webpush.setVapidDetails(
  'mailto:dino.rosas@gmail.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

app.listen(8080, function() {
    console.log('Please navigate to http://localhost:8080');
});

var getVapidKey = function(req,res){
    return res.status(200).json({ key: vapidKeys.publicKey });
}

var saveSubToDB = function(sub, res){
  sub.keys = {
    'p256dh': sub['keys[p256dh]'],
    'auth' : sub['keys[auth]']
  }
  delete sub['keys[p256dh]'];
  delete sub['keys[auth]'];

  db.push("/subscriptions[]", sub, true);

  var testEntry = db.getData("/subscriptions[-1]");

  if(testEntry === sub){
    res.status(200);
    res.setHeader('Content-Type', 'application/json');
    return res.send(JSON.stringify({
      success: {
        id: 'subscription-upload-success',
        message: 'subscription upload sucess.'
      }
    }));
  }
  else{
    res.status(400);
    res.setHeader('Content-Type', 'application/json');
    return res.send(JSON.stringify({
      error: {
        id: 'subscription-upload-failed',
        message: 'subscription upload failed.'
      }
    }));
  }
}

var sendSubscription = function(req, res){
  if (!req.body || !req.body.endpoint){
    res.status(400);
    res.setHeader('Content-Type', 'application/json');
    return res.send(JSON.stringify({
      error: {
        id: 'no-endpoint',
        message: 'Subscription must have an endpoint.'
      }
    }));
  }
  else{
    return saveSubToDB(req.body, res);
  }
}



var triggerPush = function(req, res){
  var subs = db.getData("/subscriptions");
  var testData = req.body.data;

  const triggerPushMsg = function(subscription, dataToSend, index) {
    return webpush.sendNotification(subscription, dataToSend)
    .catch((err) => {
      if (err.statusCode === 410) {
        db.delete("/subscriptions["+index+"]");
        return console.log('delete subscription from DB');
        
      } else {
        console.log('Subscription is no longer valid: ', err);
      }
    });
  };
  var promiseArr = [];

  for (let i = 0; i < subs.length; i++) {
    var subscription = subs[i];
    promiseArr.push(triggerPushMsg(subscription, testData, i));
    console.log('promiseArr', promiseArr);
  }

  Promise.all(promiseArr).then(function(arrRes){
    res.setHeader('Content-Type', 'application/json');
    return res.send(JSON.stringify({ data: { success: true } }));  
  }, function(err){
    res.status(500);
    res.setHeader('Content-Type', 'application/json');
    return res.send(JSON.stringify({
      error: {
        id: 'unable-to-send-messages',
        message: `We were unable to send messages to all subscriptions : ` +
          `'${err.message}'`
      }
    }));
  });
}

app.get('/getVapidKey', getVapidKey);

app.post('/send-subscription', sendSubscription);

app.post('/trigger-push', triggerPush);



/**
 * The logout endpoint will log the user out of the session and redirect to the landing page.
 */
app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});
