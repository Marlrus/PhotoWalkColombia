const mongoose  = require('mongoose')

const meetingPointSchema = new mongoose.Schema({
    name: String,
    description: String,
    location: String,
    dateCreated: {
        type: Date, 
        default:Date.now
    },
    //Create dateEdited apart from dateCreated
    currentVersion: Boolean,
    bookings: [{
        booking_id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Booking'
        },
        date: Date,
        name: String,
    }],
})

module.exports = mongoose.model('MeetingPoint', meetingPointSchema)