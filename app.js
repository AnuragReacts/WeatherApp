//jshint esversion:6

const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const https = require("https");
const _ = require("lodash");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.use(express.static("public"));

app.get("/", function(req,res){
  res.render("home");
});

app.post("/", function(req,res){

  //-------Api url
  const query=req.body.cityName;
  const apiKey="fa4dbbea5eaad43ebf0fbe11a21e8615";
  const units= "metric";
  const url="https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + units;
  //--------calling Api
  https.get(url, function(response){
      console.log(response.statusCode);
      if((response.statusCode)!==200)
      res.render("failure");
      //--------data response from Api
      else{
        response.on("data", function(data){

           const weatherData = JSON.parse(data);
           // res.send(weatherData);
           var desp = weatherData.weather[0].description;
           desp = _.capitalize(desp);
           const temp = weatherData.main.temp;
           const maxTemp = weatherData.main.temp_max;
           const minTemp = weatherData.main.temp_min;
           const pressure = weatherData.main.pressure;
           const humidity = weatherData.main.humidity;
           const windSpeed = weatherData.wind.speed;
           const visibility = weatherData.visibility;

           const cityName = weatherData.name;
           const icon = weatherData.weather[0].icon;
           const iconUrl= "http://openweathermap.org/img/wn/" + icon + "@2x.png";

           res.render("forecast",{cityName:cityName, iconUrl:iconUrl, desp:desp, temp:temp, maxTemp:maxTemp, minTemp:minTemp, pressure:pressure,
                                  humidity:humidity,windSpeed:windSpeed,visibility:visibility});


      });
    }
  });

});

app.get("/home", function(req,res){
  res.render("home");
});


app.listen(3000, function(){
  console.log("server started at port 3000");
});
