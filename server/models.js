const db = require("../etl/postGresConnect");

module.exports = {
  getQuestionsByProduct: async (productId) => {
    try {
      return await db.query(
        `SELECT * FROM public.questions WHERE product_id IN (${productId})`
      );
    } catch (err) {
      console.log(err);
    }
  },

  getAnswersByQuestions: async (questionId) => {
    try {
      return await db
        .query(
          `SELECT * FROM public.answers WHERE question_id IN (${questionId})`
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
          `SELECT * FROM public.answer_photos WHERE answer_id IN (${answerId})`
        )
        .then((result) => result.rows);
    } catch (err) {
      console.log(err);
    }
  },

  getAllExceptPhotos: async (productId) => {
    try {
      return await db.query(
        `SELECT * FROM public.questions as pq LEFT join public.answers as pa ON pq.id = pa.question_id WHERE pq.product_id IN (${productId}) 
          `
      );
    } catch (err) {
      console.log(err);
    }
  },
};

// SELECT * FROM member_copy WHERE id IN (17579, 17580, 17582);
/*
http://18.224.200.47/reviews/133/list/?page=1&count=10&sort=newest
"product_id": "1",
"results": [
    {
        "question_id": 3,
        "question_body": "Does this product run big or small?",
        "question_date": "2019-01-17T00:00:00.000Z",
        "asker_name": "jbilas",
        "question_helpfulness": 33,
        "reported": 0,
        "answers": {
            "124892": {
                "id": 124892,
                "body": "Meh",
                "date": "2020-05-22T00:00:00.000Z",
                "answerer_name": "Kevin",
                "helpfulness": 1,
                "photos": []
            },
            "124893": {
                "id": 124893,
                "body": "Got it for my kid and it fits perfectly",
                "date": "2020-05-22T00:00:00.000Z",
                "answerer_name": "Amy",
                "helpfulness": 0,
                "photos": []
            },
            "124894": {
                "id": 124894,
                "body": "Depends",
                "date": "2020-05-22T00:00:00.000Z",
                "answerer_name": "Kat",
                "helpfulness": 0,
                "photos": []
            }
        }
    },
    http://127.0.0.1:3000/qa/1
    {
    "product_id": "1",
    "results": [
        {
            "id": 1,
            "product_id": 1,
            "body": "What fabric is the top made of?",
            "date_written": "2018-01-04",
            "asker_name": "yankeelover",
            "asker_email": "first.last@gmail.com",
            "reported": 0,
            "helpful": 1
        },
        {
            "id": 2,
            "product_id": 1,
            "body": "HEY THIS IS A WEIRD QUESTION!!!!?",
            "date_written": "2019-04-28",
            "asker_name": "jbilas",
            "asker_email": "first.last@gmail.com",
            "reported": 1,
            "helpful": 4
        },
        {
            "id": 3,
            "product_id": 1,
            "body": "Does this product run big or small?",
            "date_written": "2019-01-17",
            "asker_name": "jbilas",
            "asker_email": "first.last@gmail.com",
            "reported": 0,
            "helpful": 8
        },
        {
            "id": 4,
            "product_id": 1,
            "body": "How long does it last?",
            "date_written": "2019-07-06",
            "asker_name": "funnygirl",
            "asker_email": "first.last@gmail.com",
            "reported": 0,
            "helpful": 6
        },
        {
            "id": 5,
            "product_id": 1,
            "body": "Can I wash it?",
            "date_written": "2018-02-08",
            "asker_name": "cleopatra",
            "asker_email": "first.last@gmail.com",
            "reported": 0,
            "helpful": 7
        },
        {
            "id": 6,
            "product_id": 1,
            "body": "Is it noise cancelling?",
            "date_written": "2018-08-12",
            "asker_name": "coolkid",
            "asker_email": "first.last@gmail.com",
            "reported": 1,
            "helpful": 19
        }
    ]
}
*/
