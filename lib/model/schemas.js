const mongoose = require('mongoose'),
      Schema   = mongoose.Schema;

const UserSchema = new Schema({
  nome     : { type: String, required: true },
  idpsn    : { type: String, required: true },
  dataNasc : { type: String, required: true },
  dataClan : { type: String, required: true },
  cidade   : { type: String, required: true },
  jogos    : { type: String, required: true },
  email    : { type: String, required: true },
  password : { type: String, required: true },
  acesso   : { type: Number, required: true, default: 0 },
});

const EventSchema = new Schema({
  name    : { type: String, required: true },
  date    : { type: String, required: true },
  players  : { type: [String], required: false },
});

module.exports = {
  UserSchema: UserSchema,
  EventSchema: EventSchema,
};