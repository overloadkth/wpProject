var mongoose = require('mongoose'),
    moment = require('moment'),
    Schema = mongoose.Schema;

var schema = new Schema({
  type: {type: String, required: true, trim: true},
  surveyid: {type: Schema.Types.ObjectId, required: true, trim: true},
  content: {type: String, trim: true},
  select1: {type: String},
  select2: {type: String},
  select3: {type: String},
  select4: {type: String},
  select5: {type: String}
}, {
  toJSON: {virtuals: true},
  toObject: {virtuals: true}
});

var Question = mongoose.model('Question', schema);

module.exports = Question;
