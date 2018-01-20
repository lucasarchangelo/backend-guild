const mongoose = require('mongoose'),
      Schema   = mongoose.Schema;

const UserSchema = new Schema({
  nome     : { type: String, required: true },
  idpsn    : { type: String, required: true, unique : true },
  dataNasc : { type: String, required: true },
  dataClan : { type: String, required: true },
  cidade   : { type: String, required: true },
  jogos    : { type: String, required: true },
  email    : { type: String, required: true, unique : true },
  password : { type: String, required: true },
  acesso   : { type: Number, required: true, default: 0 },
});

const EventSchema = new Schema({
  name    : { type: String, required: true },
  detail  : { type: String },
  gameName: { type: String, required: true },
  date    : { type: String, required: true },
  limit   : { type: Number, required: true },
  creatorPlayer    : { type: String, required: true },
  players : { type: [{ id: { type: Schema.Types.ObjectId, required: true }, idpsn: { type: String, required: true } }], required: false },
});

const GameSchema = new Schema({
  name     : { type: String, required: true },
  resetDay : { type: Number, required: true },
});

const PendencySchema = new Schema({
  name     : { type: String, required: true },
  game     : { type: String, required: true },
  weekly   : { type: Number, required: true },
  players  : { type: [{ id: { type: Schema.Types.ObjectId, required: true }, idpsn: { type: String, required: true } }], required: false },
});

module.exports = {
  UserSchema: UserSchema,
  EventSchema: EventSchema,
  GameSchema: GameSchema,
  PendencySchema: PendencySchema,
};
