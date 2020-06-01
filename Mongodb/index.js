const mongoose = require("mongoose");

const dbUrl = "mongodb://localhost:27017/QnAdb";
const db = mongoose.connect(dbUrl, { useNewUrlParser: true });

const questionsSchema = new mongoose.Schema({
  product_id: { type: Number, required: true },
  question_id: { type: Number, required: true, unique: true },
  question_body: { type: String, required: true },
  question_date: { type: Date, required: true },
  asker_name: { type: String, required: true },
  question_helpfulness: { type: Number, required: true },
  reported: { type: Number, required: true },
});

const answersSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  body: { type: String, required: true },
  date: { type: Date, required: true },
  answerer_name: { type: String, required: true },
  question_helpfulness: { type: Number, required: true },
  photos: { type: String, required: true },
  questions_id: { type: String, required: true },
});

const Questions = mongoose.model("Questions", questionsSchema);
const Answers = mongoose.model("Answers", answersSchema);

module.exports = { db, Questions, Answers };
