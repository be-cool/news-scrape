const mongoose = require("mongoose");

// Schema constructor
let Schema = mongoose.Schema;

// create new UserSchema object
let ArticleSchema = new Schema ({
    title: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    }
    // `note` is an object that stores a Note id
    // The ref property links the ObjectId to the Note model
    // note: {
    //     type: Schema.Types.ObjectId,
    //     ref: "Note"
    // }
    });

// create the model from above schema
const Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;