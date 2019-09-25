// dependencies
const express = require("express");
const mongojs = require("mongojs");
const path = require("path");
const cheerio = require("cheerio");
const axios = require("axios");

const app = express();

// database configuration
const databaseUrl = "nyt";
const collections = ["articles"];

// mongojs to hook database to the db variable
const db = mongojs(databaseUrl, collections);

// error logging if there are errors
db.on("error", function(error) {
  console.log("Database Error:", error);
});


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
        var title = $(element).text();
        // In the currently selected element, look at its child elements (i.e., its a-tags),
        // then save the values for any "href" attributes that the child elements may have
        var link = $(element).parent().attr("href");

              // If this found element had both a title and a link
            if (title && link) {
                // Insert the data in the scrapedData db
                db.nyt.insert({
                title: title,
                link: link
                },
                function(err, inserted) {
                if (err) {
                    // Log the error if one is encountered during the query
                    console.log(err);
                }
                else {
                    // Otherwise, log the inserted data
                    console.log(inserted);
          }
        });
      }
    });

    // Log the results once you've looped through each of the elements found with cheerio
    console.log(results);
    });


// ROUTES
// home route
app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname + "/public/index.html"));
});

// all route
app.get("/all", function(req, res) {
    db.articles.find({}, function(err, found) {
        if (err) {
            console.log(err);
        }
        else {
            res.json(found);
        }
    })
})

app.listen(3000, function() {
    console.log("App running on port 3000!");
  });
