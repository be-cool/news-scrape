// Grab the articles as a json
$.getJSON("/articles", function(data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page
      $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
    }
  });
  
  // Whenever someone clicks a p tag
    $(document).on("click", "p", function() {
        // Empty the notes from the note section
        $("#notes").empty();
        // Save the id from the p tag
        var thisId = $(this).attr("data-id");

        // Now make an ajax call for the Article
        $.ajax({
            method: "GET",
            url: "/articles/" + thisId
        })


// When the #make-new button is clicked
$(document).on("click", "#scrape", function() {
  // AJAX POST call to the submit route on the server
  // This will take the data from the form and send it to the server
  $.ajax({
    type: "POST",
    dataType: "json",
    url: "/scrape",
    data: {
      title: $("#title").val(),
      link: $("#link").val(),
      created: Date.now()
    }
  })
    // If that API call succeeds, add the title and a delete button for the note to the page
    .then(function(data) {
      // Add the title and delete button to the #results section
      $("#results").prepend(
        "<p class='data-entry' data-id=" +
          data._id +
          "><span class='dataTitle' data-id=" +
          data._id +
          ">" +
          data.title +
          "</span><span class=delete>X</span></p>"
      );
      // Clear the note and title inputs on the page
      $("#link").val("");
      $("#title").val("");
    });
});

// // When the #clear-all button is pressed
// $("#clear-all").on("click", function() {
//     // Make an AJAX GET request to delete the notes from the db
//     $.ajax({
//       type: "GET",
//       dataType: "json",
//       url: "/clearall",
//       // On a successful call, clear the #results section
//       success: function(response) {
//         $("#results").empty();
//       }
//     });
  });
