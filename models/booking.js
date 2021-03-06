const mongoose = require('mongoose')

const bookingSchema = new mongoose.Schema({
    //get name and image from walk
    name: String,
    image: String,
    description: String,
    short_description: String,
    date: Date,
    price: Number,
    spots: Number,
    booked_spots: {type: Number, default: 0},
    start_time: String,
    end_time: String,
    closed: Boolean,
    //create a specialStatus object?
    approved: Boolean,
    personalized: Boolean,
    seasonal: Boolean,
    pickup: Boolean,
    //Who will do the walk
    guide:{
        name: String,
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    },
    date_created: {
        type: Date, 
        default:Date.now
    },
    walk: [{
        _id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Walk'
        },
        name: String,
        image: String,
        short_description: String,
        description: String
    }],
    meetingPoint: [{
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "MeetingPoint"
        },
        name: String,
        location: String,
    }],
    clients: [{
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Client"
        },
        name: String,
        email: String,
        date_booked: Date,
        confirmation: Boolean,
        special_need: String
    }] 
})

module.exports = mongoose.model('Booking',bookingSchema)