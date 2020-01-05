// [LOAD PACKAGES]
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Memo = require("./routes/memo");
var Account = require("./routes/account");
const cors = require("cors");

// [CONFIGURE APP TO USE bodyParser]
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// [CONFIGURE SERVER PORT]
const PORT = process.env.PORT || 13000;

// [CONFIGURE ROUTER]
var router = require("./routes")(app, Memo, Account);

// [RUN SERVER]
var server = app.listen(PORT, function() {
  console.log("Express server has started on PORT " + PORT);
});

// [ CONFIGURE mongoose ]

// CONNECT TO MONGODB SERVER
var db = mongoose.connection;
db.on("error", console.error);
db.once("open", function() {
  // CONNECTED TO MONGODB SERVER
  console.log("Connected to mongod server");
});

// mongoose.connect("mongodb://id001.iptime.org:25001/my-small-memo");
mongoose.connect("mongodb://localhost/my-small-memo");
