const mongoose = require('mongoose')

const customerSchema = new mongoose.Schema({
    name: String,
    email: String,
    specialNeeds: String,
    location: String
})

module.exports = mongoose.Model('Customer',customerSchema)