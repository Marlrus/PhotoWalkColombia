const mongoose  = require('mongoose')

const meetingPointSchema = new mongoose.Schema({
    name: String,
    description: String,
    location: String,
    date_created: {
        type: Date, 
        default:Date.now
    },
    date_used: Date,
    //Create dateEdited apart from date_created
    latest_version: Boolean,
    bookings: [{
        _id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Booking'
        },
        date: Date,
        name: String,
    }],
})

module.exports = mongoose.model('MeetingPoint', meetingPointSchema)