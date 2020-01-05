var Memo = require("./memo");
var Account = require("./account");

module.exports = function(app, Memo, Account) {
  // GET ALL MEMOS
  app.get("/api/memos", function(req, res) {
    Memo.find(function(err, memos) {
      if (err) return res.status(500).send({ error: "database failure" });
      res.json(memos);
    });
  });

  // GET SINGLE MEMO
  app.get("/", function(req, res) {
    res.send("hello");
  });

  // GET SINGLE MEMO
  app.get("/api/memos/:memo_id", function(req, res) {
    res.end();
  });

  // GET MEMO BY account_id
  app.get("/api/memos/:account_id", function(req, res) {
    res.end();
  });

  // CREATE MEMO
  app.post("/api/memos", function(req, res) {
    var memo = new Memo();
    memo.title = req.body.title;
    memo.content = req.body.content;
    memo.writer = req.body.writer;
    memo.color = req.body.color;
    memo.date = req.body.date;

    memo.save(function(err) {
      if (err) {
        console.error(err);
        res.json({ result: 0 });
        return;
      }

      res.json({ result: 1 });
    });
  });

  // UPDATE THE MEMO
  app.put("/api/memos/:memo_id", function(req, res) {
    res.end();
  });

  // DELETE MEMO
  app.delete("/api/memos/:memo_id", function(req, res) {
    res.end();
  });

  // GET ALL ACCOUNTS
  app.get("/api/accounts", function(req, res) {
    res.end();
  });

  // GET ACCOUNT BY ID
  app.get("/api/accounts/:account_id", function(req, res) {
    res.end();
  });

  // CREATE ACCOUNT
  app.post("/api/accounts/:account_id", function(req, res) {
    res.end();
  });
};
