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
    booking: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Booking'
        }
    ],
    meetingPoint: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'meetingPoint'
        }
    ]
})

module.exports = mongoose.model('Client',clientSchema)