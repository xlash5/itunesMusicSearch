const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));

app.set('view engine', 'ejs');

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");


});

app.post("/", function(req, res){
  const query = req.body.query;
  const url = "https://itunes.apple.com/search?term=" + query + "&limit=5";

  https.get(url, function(response) {


    response.on("data", function(data){
      const searchData = JSON.parse(data);
      const resultNum = searchData.results.length;
      res.write("<html lang='en' dir='ltr'>")
      res.write("<h1>Itunes Music Searcher</h1>");
      res.write("<form action='/' method='post'>")
      res.write("<input type='text' name='query'>");
      res.write("</form>")
      res.write("<table style='border: 1px solid black;'>");
      for(var i = 0 ; i<resultNum ; i++){
        res.write("<tr style='border: 1px solid black;'>");
        res.write("<td style='border: 1px solid black;'><img src=" + searchData.results[i].artworkUrl100 + "></td>");
        res.write("<td style='border: 1px solid black;'>" + searchData.results[i].artistName + "</td>");
        res.write("<td style='border: 1px solid black;'>" + searchData.results[i].trackName + "</td>");


        res.write("<td style='border: 1px solid black;'>" + "<a href="+'/' +searchData.results[i].trackId +">Details</a>" + "</td>");
        res.write("</tr>");
      }


      res.write("</table>");
      res.write('</html>');
      console.log(response.statusCode);
      res.send();
    });
  });
});

app.get("/:trackId", function(req, res){
  const songURL = "https://itunes.apple.com/search?term=" + req.params.trackId;

  https.get(songURL, function(response) {
    console.log(response.statusCode);

    response.on("data", function(data){
      const songData = JSON.parse(data);

      res.render("songInfo", {artworkUrl100: songData.results[0].artworkUrl100, artistName: songData.results[0].artistName, trackName: songData.results[0].trackName, previewUrl: songData.results[0].previewUrl});
    });
  });
});


app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running");
});
