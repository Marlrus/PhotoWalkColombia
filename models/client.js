const mongoose = require('mongoose')

const clientSchema = new mongoose.Schema({
    name: String,
    email: String,
    special_needs: String,
    confirmation: Boolean,
    special_code: String,
    date_created: {
        type: Date, 
        default:Date.now
    },
    booking: [{
        _id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Booking'
        },
        date: Date,
        name: String,
        price: Number,
        start_time: String
    }],
    meetingPoint: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'meetingPoint'
        }
    ]
})

module.exports = mongoose.model('Client',clientSchema)