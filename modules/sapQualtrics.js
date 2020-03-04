/* Qualtrics module to create responses into a Qualtrics Survey */
/* Qualtrics Tenant Configuration, User Credentials and Survey parameters set in environment variables */

/** Environment Variables Required:
 *
 * QUALTRICS_TENANT
 * QUALTRICS_SURVEYID
 * QUALTRICS_TOKEN
 *
 * */
const B1SL = require("./b1");
var req = require("request"); // HTTP Client

module.exports = {
  EventSurvey: function(eventData, response) {
    return EventSurvey(eventData, response);
  }
};

function EventSurvey(eventData, callback) {
  console.log("Qualtrics Event Data: " + JSON.stringify(eventData));

  var uri =
    "https://" +
    process.env.QUALTRICS_TENANT +
    ".qualtrics.com/API/v3/surveys/" +
    eventData.SurveyID +
    "/responses/" +
    eventData.ResponseID;

  //Set HTTP Request Options
  var options = {
    uri: uri,
    headers: {
      "X-API-TOKEN": process.env.QUALTRICS_TOKEN
    }
  };

  //Make Request
  console.log("Getting Survey data from Qualtrics " + uri);
  req.get(options, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      var obj = JSON.parse(body);
      var rating = obj.result.values.QID1;
      if (rating == 1 || rating == 2) {
        var surveyText = obj.result.values.QID2_TEXT;
        console.log("Survey Text:" + surveyText);
        B1SL.PostActivity(surveyText, callback);
      }
    } else {
      callback(response.statusMessage, response);
    }
  });
}
