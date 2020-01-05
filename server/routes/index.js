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

  // CREATE MEMO
  app.post("/api/memos", function(req, res) {
    var memo = new Memo();
    memo.key = req.body.key;
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

  app.post("/api/memos/delete", function(req, res) {
    Memo.remove({ key: req.body.key }, function(err, output) {
      if (err) return res.status(500).json({ error: "database failure" });

      res.status(204).end();
    });
  });

  app.post("/api/memos/update", function(req, res) {
    Memo.updateOne(
      { key: req.body.key },
      {
        $set: {
          title: req.body.title,
          date: req.body.date,
          content: req.body.content
        }
      },
      function(err, output) {
        if (err) res.status(500).json({ error: "database failure" });
        if (!output.n) return res.status(404).json({ error: "memo not found" });
        res.json({ message: "memo updated" });
      }
    );
  });
};
