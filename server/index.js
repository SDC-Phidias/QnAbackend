const express = require("express");
// const qnaRoute = require("./routes/qnaRoute.js");
const bodyParser = require("body-parser").json;
const morgan = require("morgan");
const cors = require("cors");

const Model = require("./models.js");

const app = express();
const database = require("../etl/postGresConnect");
app.use(bodyParser());
app.use(morgan("dev"));
app.use(cors());

app.get("/loaderio-43ddd1ca0165d84a058c29a200eeca27.html", (req, res) => {
  res.send("loaderio-43ddd1ca0165d84a058c29a200eeca27");
});

app.get("/qa/:productId", async (req, res) => {
  try {
    // const client = await database.connect();
    let productId = req.params.productId;
    let questions = await Model.getQuestionsByProduct(productId);
    // if (questions.length === 0) {
    //   var questionList = await mutateQuestions(questions);
    //   finalQuestion = {};
    // } else {
    // }
    let questionList = await mutateQuestions(questions);
    // let answers = await Model.getAnswersByQuestions(
    //   questionList.map((question) => question.question_id)
    // );
    let answers =
      questionList.length > 0
        ? await Model.getAllExceptQuestions(
            questionList.map((question) =>
              question.question_id ? question.question_id : question.id
            )
          )
        : [];
    // let answers =
    //   (await Model.getAllExceptQuestions(
    //     questionList.map((question) =>
    //       question.question_id ? question.question_id : question.id
    //     )
    //   )) || [];

    let finalanswers = await mutateAnswers(answers.rows ? answers.rows : []);

    // console.log(answers);

    // let fullphotos = await Model.getPhotosByAnswers(
    //   answers.map((answer) => answer.id)
    // );
    // let finalQuestion = await Model.getAllExceptPhotos(productId);
    // let fullList = await Model.getAllExceptPhotos(productId);
    function mutateAnswers(input) {
      for (const answer of input) {
        if (
          answer.string_agg !== null &&
          answer.string_agg.indexOf(",") !== -1
        ) {
          let finals = answer.string_agg.split(", ");
          answer.string_agg = [...finals];
        } else {
          answer.string_agg = [];
        }
      }

      return input;
    }

    function mutateQuestions(input) {
      for (const question of input) {
        if (typeof question["helpful"] === "number") {
          question["question_helpfulness"] = question["helpful"];
          question["question_id"] = question["id"];
          question["question_body"] = question["body"];
          question["question_date"] = question["date_written"]; // Assign new key
          delete question["helpful"];
          delete question["id"];
          delete question["body"];
          delete question["date_written"]; // Delete old key
        }
      }
      return input;
    }

    // console.log("QUESTIONS:", questions.rows);

    // function addPhotos(input) {
    //   for (const answer of input) {
    //     answer.photos = [];

    //     for (photo of fullphotos) {
    //       if (photo.answer_id === answer.id) {
    //         answer.photos.push(photo.url);
    //       }
    //     }
    //   }
    //   return input;
    // }
    // let finalAnswers = await addPhotos(answers);

    let finalQuestion = await addAnswers(questionList);
    function addAnswers(input) {
      for (const question of input) {
        question.answers = {};

        for (answer of finalanswers) {
          if (answer.question_id === question.question_id) {
            let {
              id,
              body,
              date_written,
              answerer_name,
              helpful,
              string_agg,
            } = answer;
            question.answers[id] = {
              id,
              body,
              date: date_written,
              answerer_name,
              helpfulness: helpful,
              photos: string_agg || [],
            };
          }
        }
      }
      return input;
    }

    res.send({
      product_id: productId,
      results: finalQuestion,
      // lists: finalanswers,
    });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
    return;
  }
});

app.get("/qa/:questionId/answers", async (req, res) => {
  try {
    let questionId = req.params.questionId;

    let answers = await Model.getAllExceptQuestions(questionId).then(
      (results) => results.rows
    );

    console.log(answers);

    res.send({
      question: questionId,
      count: Number(req.query.count || 5),
      results: answers.map((row) => ({
        answer_id: row.answer_id,
        body: row.body,
        date: row.date_written,
        answerer_name: row.answerer_name,
        helpfulness: row.helpful,
        photos: row.photos ? row.photos : [],
      })),
    });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
    return;
  }
});

app.post("/qa/:productId", (req, res) => {
  const productId = req.params.productId;
  const { body, nickName, email } = req.body;

  if (!productId || !body || !nickName || !email) {
    res.status(400).send("productId, body, name, and email are all required");
    return;
  }

  Model.addQuestion({
    productId,
    asker_email: email,
    asker_name: nickName,
    body,
  })
    .then(res.sendStatus(201))
    .catch((err) => res.sendStatus(500));
});

app.post("/qa/:questionId/answers", (req, res) => {
  const questionId = req.params.questionId;
  const { body, nickName, email, photos } = req.body;

  if (!questionId || !body || !nickName || !email) {
    res
      .status(400)
      .send("questionId, body, nickname, and email are all required");
    return;
  }

  Model.addAnswer({
    questionId,
    answerer_email: email,
    answerer_name: nickName,
    body,
    photos,
  })
    .then(() => res.sendStatus(201))
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
});

app.put("/qa/question/:questionId/helpful", (req, res) => {
  Model.addHelpfulToQuestions(req.params.questionId)
    .then(() => res.sendStatus(204))
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
});

app.put("/qa/answer/:answerId/helpful", (req, res) => {
  Model.addHelpfulToAnswers(req.params.answerId)
    .then(() => res.sendStatus(204))
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
});

app.put("/qa/question/:questionId/report", (req, res) => {
  Model.reportQuestion(req.params.questionId)
    .then(() => res.sendStatus(204))
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
});

app.put("/qa/answer/:answerId/report", (req, res) => {
  Model.reportAnswer(req.params.answerId)
    .then(() => res.sendStatus(204))
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

module.exports = app;
