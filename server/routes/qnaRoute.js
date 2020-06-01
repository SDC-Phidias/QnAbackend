const express = require("express");
const qnaController = require("../controllers/qnaController.js");

const router = express.Router();

router.get("/:product_id", qnaController.questions);

router.get("/:question_id/answers", qnaController.answers);

router.post("/:product_id", qnaController.addQuestions);

router.post("/:question_id/answers", qnaController.addAnswers);

module.exports = router;
