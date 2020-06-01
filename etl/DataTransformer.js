const fs = require("fs");
const csv = require("csv-parser");
const CSVCleaner = require("./CSVCleanerTransformer");
const transformer = new CSVCleaner({ writableObjectMode: true });

let readStream = fs.createReadStream(
  "/Users/ahsanawan/QnAbackend/etl/data/questions.csv"
);
let writeStream = fs.createWriteStream(
  "/Users/ahsanawan/QnAbackend/etl/data/newtest.csv"
);

const createCsvStringifier = require("csv-writer").createObjectCsvStringifier;
const csvStringifier = createCsvStringifier({
  header: [
    { id: "id", title: "id" },
    { id: "product_id", title: "product_id" },
    { id: "body", title: "body" },
    { id: "date_written", title: "date_written" },
    { id: "asker_name", title: "asker_name" },
    { id: "asker_email", title: "asker_email" },
    { id: "reported", title: "reported" },
    { id: "helpful", title: "helpful" },
  ],
});

writeStream.write(csvStringifier.getHeaderString());

readStream
  .pipe(csv())
  .pipe(transformer)
  .pipe(writeStream)
  .on("finish", () => {
    console.log("finished");
  });
