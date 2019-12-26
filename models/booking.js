const mongoose = require('mongoose')

const bookingSchema = new mongoose.Schema({
    date: Date,
    price: String,
    spots: Number,
    startTime: String,
    endTime: String,
    walk: {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Walk'
        }
    }
})

module.exports = mongoose.model('Booking',bookingSchema)