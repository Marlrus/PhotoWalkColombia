const mongoose = require("mongoose")

const walkSchema = new mongoose.Schema({
    name: String,
    description: String,
    dateCreated: {
        type: Date, 
        default:Date.now
    },
    //Create dateEdited apart from dateCreated
    visible: Boolean,
    price: String,
    nextDate: String,

})

module.exports = mongoose.model("Walk",walkSchema)