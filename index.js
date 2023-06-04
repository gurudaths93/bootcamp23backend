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

app.get('/getSurveyResults', function (req, res) {
  fs.readFile("./surveyresults.json", "utf8", (err, jsonString) => {
    if (err) {
      console.log("File read failed:", err);
      return;
    }
    console.log("File data:", jsonString);
    let data1 = JSON.parse(jsonString);
    res.send(data1);
});

});

app.post('/insertQuestions',function(req,res){
  questions = req.body.data;
  console.log(questions)
  console.log(questions.length)
  let questionsArray = [];
  for(let i=0;i<questions.length;i++){
    let quest = {
      "Q":questions[i],
      "count":0,
      "feedback":[]
    }
    questionsArray.push(quest);
  }
  console.log(questionsArray);
  fs.readFile("./surveyresults.json", "utf8", (err, jsonString) => {
    if (err) {
      console.log("File read failed:", err);
      return;
    }
    console.log("File data:", jsonString);
    let data1 = JSON.parse(jsonString);
    data1["feedbackResults"] = questionsArray;
    fs.writeFile("surveyresults.json",JSON.stringify(data1), function(err) {
      if(err) {
          return console.log(err);
      }
      res.send({
        "status":"success",
        "message":"survey stored successfully"
      })
  });
  res.send({
    "status":"success",
    "message":"questions saved successfully"
  });
});
});

app.get('/resetSurvey', function (req, res) {
  fs.readFile("./surveyresults.json", "utf8", (err, jsonString) => {
    if (err) {
      console.log("File read failed:", err);
      return;
    }
    console.log("File data:", jsonString);
    let data1 = JSON.parse(jsonString);
    for(let i=0;i<data1.feedbackResults.length;i++){
      data1.feedbackResults[i]["count"] = 0;  
      data1.feedbackResults[i]["feedback"] = [];
    }
    data1.feedback = []

    fs.writeFile("surveyresults.json",JSON.stringify(data1), function(err) {
        if(err) {
            return console.log(err);
        }
        res.send({
          "status":"success",
          "message":"data was reset"
        })
    });
  });
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
        for(let i=0;i<data1.feedbackResults.length;i++){
          data1.feedbackResults[i]["count"] = data1.feedbackResults[i]["count"] +1;;  
          data1.feedbackResults[i]["feedback"].push(surveyResults[i]);
        }
        if(surveyResults[data1.feedbackResults.length] != ""){
            data1.feedback.push(surveyResults[data1.feedbackResults.length])

        }

        fs.writeFile("surveyresults.json",JSON.stringify(data1), function(err) {
            if(err) {
                return console.log(err);
            }
            res.send({
              "status":"success",
              "message":"survey stored successfully"
            })
        });
      });
    
  });

 
app.listen(port, function () {
  console.log('Example app listening on port 1337!');
});