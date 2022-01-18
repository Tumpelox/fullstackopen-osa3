const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator');

var dotenv = require('dotenv').config()

const url = process.env.MONGO_URL

mongoose.connect(url)

const contactSchema = new mongoose.Schema({
    name:  { type: String, unique: true, minlength: 3 },
    number: { type: String, minlength: 8 },
})

contactSchema.plugin(uniqueValidator);

contactSchema.set('toJSON', {
transform: (doc, response) => {
    response.id = response._id.toString()
    delete response._id
    delete response.__v
}
})

const Contact = mongoose.model('Contact', contactSchema)
module.exports = Contact
