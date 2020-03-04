const mongoose = require('mongoose')

const leadSchema = new mongoose.Schema({
    name: String,
    email: String,
    subject: String,
    message: String,
    origin: String,
    is_verified: Boolean,
})

module.exports = mongoose.model('lead',leadSchema)