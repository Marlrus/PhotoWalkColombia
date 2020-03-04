const mongoose = require("mongoose")

const walkSchema = new mongoose.Schema({
    name: String,
    image: String,
    other_images:[
        String
    ],
    short_description: String,
    description: String,
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
        price: Number,
        spots: Number,
        booked_spots: Number,
    }]
})

module.exports = mongoose.model("Walk",walkSchema)