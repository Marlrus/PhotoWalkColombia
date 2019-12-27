const mongoose = require('mongoose')

const clientSchema = new mongoose.Schema({
    name: String,
    email: String,
    specialNeeds: String,
    location: String
})

module.exports = mongoose.Model('Client',clientSchema)