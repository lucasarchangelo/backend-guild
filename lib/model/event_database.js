// NPM packages
const mongoose = require('mongoose'),
bcrypt = require('bcryptjs'),
logger = require('winston'),
schemas = require('./schemas');

const mongoUrl = process.env.MONGODB_URI;
mongoose.connect(mongoUrl);

const User = mongoose.model('Event', schemas.EventSchema);

const Database = {
}