const mongoose = require("mongoose")

const walkSchema = new mongoose.Schema({
    name: String,
    image: String,
    shortDescription: String,
    description: String,
    dateCreated: {
        type: Date, 
        default:Date.now
    },
    //Create dateEdited apart from dateCreated
    currentVersion: Boolean,
    usedInBooking: [{
        booking_id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Booking'
        },
        date: Date,
        price: Number,
        spots: Number,
        bookedSpots: Number,
    }]
})

module.exports = mongoose.model("Walk",walkSchema)