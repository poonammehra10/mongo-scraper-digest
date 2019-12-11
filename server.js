let express = require("express");
let bodyParser = require("body-parser");
let request = require("request");
let mongoose = require("mongoose");
let Note = require("./models/Note.js");
let Article = require("./models/Article.js");
let Save = require("./models/Save.js");
let logger = require("morgan");
let cheerio = require("cheerio");
let path = require("path");
let app = express();
let PORT = process.env.PORT || 3001;

// Parse application/x-www-form-urlencoded
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(express.static("./public"));

// connect to database
mongoose.Promise = Promise;
let dbConnect = process.env.MONGODB_URI || "mongodb://localhost/foxsScrape";
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI);
} else {
  mongoose.connect(dbConnect);
}

// Connect mongoose to our database

let db = mongoose.connection;
db.on("error", function(err) {
  console.log("Mongoose Error", err);
});
db.once("open", function() {
  console.log("Mongoose connection is successful");
});
var exphbs = require("express-handlebars");

app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);

app.set("view engine", "handlebars");

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "views/index.html"));
});

require("./routes/scrape")(app);
require("./routes/html.js")(app);

app.get("*", function(req, res) {
  res.sendFile(path.join(__dirname, "views/index.html"));
});

app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});
