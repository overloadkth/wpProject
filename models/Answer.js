var mongoose = require('mongoose'),
    moment = require('moment'),
    Schema = mongoose.Schema;

var schema = new Schema({
  surveyid: {type: Schema.Types.ObjectId, required: true, trim: true},
  questionid: {type: Schema.Types.ObjectId, required: true, trim: true},
  answer: {type: String, trim: true},
  select1: {type: Number, default: 0},
  select2: {type: Number, default: 0},
  select3: {type: Number, default: 0},
  select4: {type: Number, default: 0},
  select5: {type: Number, default: 0}
}, {
  toJSON: {virtuals: true},
  toObject: {virtuals: true}
});

var Answer = mongoose.model('Answer', schema);

module.exports = Answer;
