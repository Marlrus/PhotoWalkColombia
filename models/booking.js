const mongoose = require('mongoose')

const bookingSchema = new mongoose.Schema({
    //get name and image from walk
    name: String,
    image: String,
    description: String,
    shortDescription: String,
    date: Date,
    price: Number,
    spots: Number,
    bookedSpots: {type: Number, default: 0},
    startTime: String,
    endTime: String,
    closed: Boolean,
    //create a specialStatus object?
    approved: Boolean,
    personalized: Boolean,
    seasonal: Boolean,
    pickup: Boolean,
    dateCreated: {
        type: Date, 
        default:Date.now
    },
    walk: [{
        walk_id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Walk'
        },
        name: String,
        image: String,
        shortDescription: String,
        description: String
    }],
    meetingPoint: [{
        meetingPoint_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "MeetingPoint"
        },
        name: String,
        location: String,
        date: Date
    }],
    clients: [{
        client_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Client"
        },
        name: String,
        email: String,
        date_booked: Date,
        confirmation: Boolean
    }] 
})

module.exports = mongoose.model('Booking',bookingSchema)