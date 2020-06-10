const db = require("../etl/postGresConnect");

module.exports = {
  getQuestionsByProduct: async (productId) => {
    const client = await db.connect();

    try {
      return await client
        .query(
          `SELECT * FROM public.questions WHERE product_id IN (${productId});`
        )
        .then((questions) => questions.rows);
    } catch (err) {
      console.log(err);
      client.release();
    } finally {
      client.release();
    }
  },

  getAnswersByQuestions: async (questionId) => {
    try {
      return await db
        .query(
          `SELECT * FROM public.answers WHERE question_id IN (${questionId});`
        )
        .then((result) => result.rows);
    } catch (err) {
      console.log(err);
    }
  },

  getPhotosByAnswers: async (answerId) => {
    try {
      return await db
        .query(
          `SELECT * FROM public.answer_photos WHERE answer_id IN (${answerId});`
        )
        .then((result) => result.rows);
    } catch (err) {
      console.log(err);
    }
  },

  addHelpfulToQuestions: async (questionId) => {
    try {
      return await db
        .query(
          `UPDATE public.questions SET helpful = helpful + 1 WHERE id = ${questionId};`
        )
        .then((result) => result.rows);
    } catch (err) {
      console.log(err);
    }
  },

  addHelpfulToAnswers: async (answerId) => {
    try {
      return await db
        .query(
          `UPDATE public.finalaggregate SET helpful = helpful + 1 WHERE id = ${answerId};`
        )
        .then((result) => result.rows);
    } catch (err) {
      console.log(err);
    }
  },

  reportQuestion: async (questionId) => {
    try {
      return await db
        .query(
          `UPDATE public.questions SET reported = 1 WHERE id = ${questionId};`
        )
        .then((result) => result.rows);
    } catch (err) {
      console.log(err);
    }
  },

  reportAnswer: async (answerId) => {
    try {
      return await db
        .query(
          `UPDATE public.finalaggregate SET reported = 1 WHERE id = ${answerId};`
        )
        .then((result) => result.rows);
    } catch (err) {
      console.log(err);
    }
  },

  addQuestion: async ({ productId, asker_email, asker_name, body }) => {
    try {
      if (!productId || !asker_email || !asker_name || !body) {
        return new Promise((resolve, reject) =>
          reject("productId, email, nickName, and body are all required")
        );
      }
      return await db
        .query(
          `INSERT INTO public.questions(id, product_id, body, date_written, asker_name, asker_email) VALUES (nextval('id_sequence'), ${productId}, ${body}, CURRENT_DATE, ${asker_name}, ${asker_email})`
        )
        .then((data) => data.rows);
    } catch (err) {
      console.log(err);
    }
  },

  addAnswer: async ({
    question_id,
    answerer_name,
    answerer_email,
    body,
    photos,
  }) => {
    try {
      if (!question_id || !answerer_email || !answerer_name || !body) {
        return new Promise((resolve, reject) =>
          reject(
            "question_id, answerer_name, answerer_email, and body are all required"
          )
        );
      }
      return await db
        .query(
          `INSERT INTO public.finalaggregate(id, question_id, body, date_written, answerer_name, answerer_email, string_agg) VALUES (nextval('answerid_sequence'), ${question_id}, ${body}, CURRENT_DATE, ${answerer_name}, ${answerer_email}, ${photos})`
        )
        .then((data) => data.rows);
    } catch (err) {
      console.log(err);
    }
  },

  getAllExceptQuestions: async (questionId) => {
    const client = await db.connect();
    try {
      return await client.query(
        `SELECT * FROM public.finalaggregate WHERE question_id IN (${questionId});`
      );
    } catch (err) {
      console.log(err);
      client.release();
    } finally {
      client.release();
    }
  },
};
