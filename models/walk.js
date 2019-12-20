const mongoose = require("mongoose")

const walkSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    dateCreated: {
        type: Date, 
        default:Date.now
    },
    //Create dateEdited apart from dateCreated
    visible: Boolean,
    price: String,
    nextDate: Date,
    spots: String,
    startTime: String,
    endTime: String,
    meetingPoint: {
        name: String,
        description: String
    }
})

module.exports = mongoose.model("Walk",walkSchema)