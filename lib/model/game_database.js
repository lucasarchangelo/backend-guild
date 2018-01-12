// NPM packages
const mongoose = require('mongoose'),
bcrypt = require('bcryptjs'),
logger = require('winston'),
schemas = require('./schemas');

const mongoUrl = process.env.MONGODB_URI || 'mongodb://localhost:27017/estudos';

mongoose.connect(mongoUrl);

const Event = mongoose.model('Event', schemas.GameSchema);

const Database = {}