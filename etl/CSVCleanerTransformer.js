const csv = require("csv-parser");
const createCsvStringifier = require("csv-writer").createObjectCsvStringifier;
const fs = require("fs");
const Transform = require("stream").Transform;
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

class CSVCleaner extends Transform {
  constructor(options) {
    super(options);
  }
  _transform(chunk, encoding, next) {
    for (let key in chunk) {
      // trims whitespace
      if (!chunk[key]) {
        let trimKey = key.trim();
        chunk[trimKey] = chunk[key];
      }
      if (key !== key.trim()) {
        delete chunk[key];
      }
    }

    // filters out all non-number characters
    // let onlyNumbers = chunk.default_price.replace(/\D/g, "");
    // chunk.default_price = onlyNumbers;

    chunk = csvStringifier.stringifyRecords([chunk]);
    // chunk = skusCsvStringifier.stringifyRecords([chunk]);
    this.push(chunk);
    next();
  }
}

module.exports = CSVCleaner;
