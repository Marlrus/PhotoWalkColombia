const mongoose = require('mongoose')

const bookingSchema = new mongoose.Schema({
    date: Date,
    price: String,
    spots: Number,
    startTime: String,
    endTime: String,
    walk: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Walk'
        }
    ],
    meetingPoint: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "MeetingPoint"
        }
    ]
})

module.exports = mongoose.model('Booking',bookingSchema)