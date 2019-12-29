const mongoose = require('mongoose')

const bookingSchema = new mongoose.Schema({
    date: Date,
    price: String,
    spots: Number,
    bookedSpots: {type: Number, default: 0},
    startTime: String,
    endTime: String,
    pickup: Boolean,
    dateCreated: {
        type: Date, 
        default:Date.now
    },
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
    clients: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Client"
        }
    ] 
})

module.exports = mongoose.model('Booking',bookingSchema)