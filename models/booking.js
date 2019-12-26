const mongoose = require('mongoose')

const bookingSchema = new mongoose.Schema({
    date: Date,
    price: String,
    spots: Number,
    bookedSpots: {type: Number, default: 0},
    startTime: String,
    endTime: String,
    pickup: Boolean,
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
    ],
    customers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer"
        }
    ] 
})

module.exports = mongoose.model('Booking',bookingSchema)