var express = require('express');
var app = express();
const fs = require('fs');

const port = process.env.PORT || 1337;
const bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.post('/submitSurvey', function (req, res) {
    // console.log(req.body.data);
    surveyResults = req.body.data;

    console.log(surveyResults);
    fs.readFile("./surveyresults.json", "utf8", (err, jsonString) => {
        if (err) {
          console.log("File read failed:", err);
          return;
        }
        console.log("File data:", jsonString);
        let data1 = JSON.parse(jsonString);
        data1.feedbackResults[0]["count"] = data1.feedbackResults[0]["count"] +1;
        data1.feedbackResults[1]["count"] = data1.feedbackResults[1]["count"] +1;
        data1.feedbackResults[2]["count"] = data1.feedbackResults[2]["count"] +1;
        data1.feedbackResults[3]["count"] = data1.feedbackResults[3]["count"] +1;
        data1.feedbackResults[4]["count"] = data1.feedbackResults[4]["count"] +1;
        data1.feedbackResults[0]["feedback"].push(surveyResults[0])
        data1.feedbackResults[1]["feedback"].push(surveyResults[1])
        data1.feedbackResults[2]["feedback"].push(surveyResults[2])
        data1.feedbackResults[3]["feedback"].push(surveyResults[3])
        data1.feedbackResults[4]["feedback"].push(surveyResults[4])
        if(surveyResults[5] != ""){
            data1.feedback.push(surveyResults[5])

        }

        fs.writeFile("surveyresults.json",JSON.stringify(data1), function(err) {
            if(err) {
                return console.log(err);
            }
            res.send("file was savedhunok")
        });
      });
    
  });

 
app.listen(port, function () {
  console.log('Example app listening on port 3000!');
});