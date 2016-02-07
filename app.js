var express = require('express');
var bodyParser = require('body-parser');
var Web3 = require('web3');

web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

var accountFrom = "0x2de5f33aa9de8cfc053f99ea85b8ac10096c5359";
var accountTo = "0x35c61d2e4f03418e64167a1023f75030ff8867b8";

function createTransaction(data) {
  return {
    from : accountFrom,
    to: accountTo,
    value: 1,
    data: web3.toHex("kopec ia zadolbalas")
  }
};

var app = express();

app.use(express.static('public'));
app.use(express.static('bower_components'));

app.use(bodyParser.json());

app.post('/chain', function(req, res) {
  web3.eth.sendTransaction(createTransaction(req.body.data),
  function(error, result){
    if(!error) {
      res.send({ transaction: result});
    } else {
      res.status(500).send(error);
      console.log(error);
    }
  });
});

app.get('/chain/:transactionId', function(req, res) {
  web3.eth.getTransaction(req.params.transactionId,
  function(error, result){
    if(!error) {
      res.send({ block: result.blockHash, data: web3.toAscii(result.input) });
    } else {
      res.status(500).send(error);
      console.log(error);
    }
  })
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');

  if(web3.isConnected())
    console.log("You incredibly lucky, the connection is established!!!");

  console.log("Check balances:");
  var balance = web3.eth.getBalance(accountFrom);
  console.log("Balance AccountFrom: ", balance.toNumber());
  balance = web3.eth.getBalance(accountTo);
  console.log("Balance AccountTo :", balance.toNumber());
});
