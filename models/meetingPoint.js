const mongoose  = require('mongoose')

const meetingPointSchema = new mongoose.Schema({
    name: String,
    description: String,
    dateCreated: {
        type: Date, 
        default:Date.now
    },
    //Create dateEdited apart from dateCreated
    currentVersion: Boolean,
    used:[
        {
            booking: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Booking'
            },
            walk: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Walk'
            }
        }
    ] 
})

module.exports = mongoose.model('MeetingPoint', meetingPointSchema)