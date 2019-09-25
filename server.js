// dependencies
const express = require("express");
const mongoose = require("mongoose");
const logger = require("morgan")

const cheerio = require("cheerio");
const axios = require("axios");

// // database configuration
// const databaseUrl = "nyt";
// const collections = ["articles"];

// mongojs to hook database to the db variable
const db = require("./models");
const PORT = 3000;

const app = express();

// Configure middleware
// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// connect to the mongo db
mongoose.connect("mongodb://localhost/nyt", { useNewUrlParser: true });

// SCRAPE
console.log("\n***********************************\n" +
            "Grabbing every article name and link\n" +
            "from NYT's articles and putting them into mongodb:" +
            "\n***********************************\n");

            // Scrape data from one site and place it into the mongodb db
app.get("/scrape", function(req, res) {
// Making a request via axios for reddit's "webdev" board. We are sure to use old.reddit due to changes in HTML structure for the new reddit. The page's Response is passed as our promise argument.
    axios.get("https://www.nytimes.com/section/world/americas").then(function(response) {

        // Load the Response into cheerio and save it to a variable
        // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
        var $ = cheerio.load(response.data);
        $("h2.css-1j9dsxy").each(function(i, element) {
        // Save the text of the element in a "title" variable
        var result = {};
        
        result.title = $(this).text();
        // In the currently selected element, look at its child elements (i.e., its a-tags),
        // then save the values for any "href" attributes that the child elements may have
        result.link = $(this).parent().attr("href");

        // create a new Article
        db.Article.create(result)
        .then(function(dbArticle) {
            console.log(dbArticle);
        })
        .catch(function(err) {
            console.log(err)
        });
        });
    

    // Log the results once you've looped through each of the elements found with cheerio
    res.send("scrape complete")
    });


// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
    // Grab every document in the Articles collection
    db.Article.find({})
      .then(function(dbArticle) {
        // If we were able to successfully find Articles, send them back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  })});
