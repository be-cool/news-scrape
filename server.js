// dependencies
const express = require("express");
const mongojs = require("mongojs");
const path = require("path");

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


// ROUTES
// home route
app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname + "./public/index.html"));
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
