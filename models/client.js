const mongoose = require('mongoose')

const clientSchema = new mongoose.Schema({
    name: String,
    family_name: String,
    profile_image: String,
    email: String,
    special_needs: String,
    confirmation: Boolean,
    special_code: String,
    locale: String,
    auth:{
        google: Boolean,
        local: Boolean,
        external_id: String,
        verified_email: Boolean,
    },
    date_created: {
        full: {
            type: Date, 
            default:Date.now
        },
        month: Number,
        year: Number
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