var express = require('express'),
  bodyParser = require('body-parser'),
  path = require('path') 
var app = express();
var crypto = require("crypto");
var consumerSecretApp = process.env.CANVAS_CONSUMER_SECRET || '5AE4CA1543118B24EDA3A67A68BFB4AB7564E6229C33AABD09416D36BC9CA3CB';

console.log('consumer secret - '+consumerSecretApp);

app.use(express.static(path.join(__dirname, 'views')));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded());

app.use(bodyParser.json());
 

app.get('/', function (req, res) {
  res.render('hello');
});

app.post('/', function (req, res) { 
  var bodyArray = req.body.signed_request.split(".");
    var consumerSecret = bodyArray[0];
    var encoded_envelope = bodyArray[1];

    var check = crypto.createHmac("sha256", consumerSecretApp).update(encoded_envelope).digest("base64");

    if (check === consumerSecret) { 
        var envelope = JSON.parse(new Buffer(encoded_envelope, "base64").toString("ascii"));
        //req.session.salesforce = envelope;
        console.log("got the session object:");
        console.log(envelope);
        console.log(JSON.stringify(envelope) );
        res.render('index', { title: envelope.context.user.userName, req : JSON.stringify(envelope) });
    }else{
        res.send("authentication failed");
    } 
})
 
app.listen(3000 , function () {
	console.log ("server is listening!!!");
} );