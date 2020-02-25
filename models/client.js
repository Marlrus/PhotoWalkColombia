const mongoose = require('mongoose')

const clientSchema = new mongoose.Schema({
    name: String,
    email: String,
    specialNeeds: String,
    confirmation: Boolean,
    specialCode: String,
    dateCreated: {
        type: Date, 
        default:Date.now
    },
    booking: [{
        booking_id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Booking'
        },
        date: Date,
        name: String,
        price: Number,
        startTime: String
    }],
    meetingPoint: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'meetingPoint'
        }
    ]
})

module.exports = mongoose.model('Client',clientSchema)