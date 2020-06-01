const qnaController = {
  questions: (req, res) => {
    res.send([]);
    console.log("questions");
  },
  answers: (req, res) => {
    console.log(req.params);
  },
  addQuestions: (req, res) => {
    console.log(req.params, "addQ");
  },
  addAnswers: (req, res) => {
    console.log(req.params, "addA");
  },
};

module.exports = qnaController;
