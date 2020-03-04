"use strict";
const B1 = require("./modules/b1");
const QUALTRICS = require("./modules/sapQualtrics");
const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');

var app = express();
var responseID;

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.use(cors());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

//End-point to fill qualtrics surveys
app.post("/", function(req, res) {
  // loop to avoid duplicated calls with the same ResponseID
  if (responseID != req.body.ResponseID) {
    responseID = req.body.ResponseID;
  } else { return };
  
  //Get Survey response and post to B1
  QUALTRICS.EventSurvey(req.body, function(error, resp) {
    if (error) {
      console.error("Error - " + error);
      res.send(error);
    } else {
      var jsonResponse = JSON.stringify({ surveyresp: resp });
      res.setHeader("Content-Type", "application/json");
      res.status(200).send(jsonResponse);
    }
  });
});

var port = process.env.PORT || 30000;
app.listen(port, function() {
  console.log("XO listening on port " + port);

});
