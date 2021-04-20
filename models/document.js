const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    documentType: String,
    claimedId: String,
    createdAT: {
        type: String,
        required: true,
        default: Date.now(),
    },
    numcopies: Number,
    docLanguage: String,
});
module.exports = mongoose.model("document", userSchema);