const mongoose  = require('mongoose')

const meetingPointSchema = new mongoose.Schema({
    name: String,
    description: String
})

module.exports = mongoose.model('MeetingPoint', meetingPointSchema)