const mongoose = require("mongoose")

const walkSchema = new mongoose.Schema({
    name: String,
    image: String,
    shortDescription: String,
    description: String,
    dateCreated: {
        type: Date, 
        default:Date.now
    },
    //Create dateEdited apart from dateCreated
    currentVersion: Boolean,
    meetingPoint: {
        name: String,
        description: String
    }
})

module.exports = mongoose.model("Walk",walkSchema)