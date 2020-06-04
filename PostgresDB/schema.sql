CREATE SCHEMA
IF NOT EXISTS qna;

CREATE TABLE qna.questions
(
    id bigserial NOT NULL ,
    product_id integer   ,
    body varchar(1000)   ,
    date_written varchar(50)   ,
    asker_name varchar(30)   ,
    asker_email varchar   ,
    reported integer   ,
    helpful integer   ,
    CONSTRAINT unq_questions_id UNIQUE ( id ) ,
    CONSTRAINT pk_questions_id PRIMARY KEY ( id )
);

CREATE TABLE qna.answers
(
    id integer NOT NULL ,
    question_id integer   ,
    body varchar(200)   ,
    date_written varchar(50)   ,
    answerer_name varchar(100)   ,
    answerer_email varchar   ,
    reported integer   ,
    helpful integer   ,
    CONSTRAINT pk_answers_id PRIMARY KEY ( id )
);

CREATE TABLE qna.answer_photos
(
    id integer NOT NULL ,
    answer_id integer   ,
    url varchar(500)   ,
    CONSTRAINT pk_answer_photos_id PRIMARY KEY ( id )
);

ALTER TABLE qna.answer_photos ADD CONSTRAINT fk_answer_photos_answers FOREIGN KEY ( answer_id ) REFERENCES qna.answers( id );

ALTER TABLE qna.answers ADD CONSTRAINT fk_answers_questions FOREIGN KEY ( question_id ) REFERENCES qna.questions( id )  ON UPDATE CASCADE;

COPY qna.questions FROM "/Users/ahsanawan/QnAbackend/etl/data/questions.csv" DELIMITER "," CSV HEADER ;

COPY qna.answers FROM '/Users/ahsanawan/QnAbackend/etl/data/answers.csv' DELIMITER ',' CSV HEADER ;

COPY qna.answer_photos FROM '/Users/ahsanawan/QnAbackend/etl/data/answers_photos.csv' DELIMITER ',' CSV HEADER ;