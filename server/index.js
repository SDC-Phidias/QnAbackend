const express = require("express");
// const qnaRoute = require("./routes/qnaRoute.js");
const bodyParser = require("body-parser").json;
const morgan = require("morgan");
const cors = require("cors");

const Model = require("./models.js");
// const { paginate } = require('./utils.js');

const app = express();
app.use(bodyParser());
app.use(morgan("dev"));
app.use(cors());

app.get("/qa/:productId", async (req, res) => {
  try {
    let productId = req.params.productId;

    let questions = await Model.getQuestionsByProduct(productId);
    let questionList = await mutateQuestions(questions.rows);
    // let fullList = await Model.getAllExceptPhotos(productId);

    function mutateQuestions(input) {
      for (const question of input) {
        if (question["helpful"]) {
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

    // questions = paginate(
    //   questions.sort((a, b) => b.question_helpfulness - a.question_helpfulness),
    //   req.query.page,
    //   req.query.count
    // );

    let answers = await Model.getAnswersByQuestions(
      questionList.map((question) => question.question_id)
    );

    let fullphotos = await Model.getPhotosByAnswers(
      answers.map((answer) => answer.id)
    );

    function addPhotos(input) {
      for (const answer of input) {
        answer.photos = [];

        for (photo of fullphotos) {
          if (photo.answer_id === answer.id) {
            answer.photos.push(photo.url);
          }
        }
      }
      return input;
    }
    let finalAnswers = await addPhotos(answers);
    let finalQuestion = await addAnswers(questionList);
    function addAnswers(input) {
      for (const question of input) {
        question.answers = {};

        for (answer of finalAnswers) {
          if (answer.question_id === question.question_id) {
            let {
              id,
              body,
              date_written,
              answerer_name,
              helpful,
              photos,
            } = answer;
            question.answers[id] = {
              id,
              body,
              date: date_written,
              answerer_name,
              helpfulness: helpful,
              photos: photos || [],
            };
          }
        }
      }
      return input;
    }

    res.send({
      product_id: productId,
      results: finalQuestion,
      // lists: fullList,
    });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
    return;
  }
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

module.exports = app;
