// ======================
//      Dependencies
// ======================

const mongoose = require("mongoose");
// Create a Schema class
const Schema = mongoose.Schema;

// Make the Article Schema here:
var MongoExampleSchema = new Schema({
    // The link is another required string
    name: {
        type: String,
        required: true
    },
    abbr: {
        type: String
    },
    code: {
        type: String 
    }
});

// Now we actually make the Code model using the CodeSchema
const MongoExample = mongoose.model("MongoExample", MongoExampleSchema);

// Export the model
module.exports = MongoExample;