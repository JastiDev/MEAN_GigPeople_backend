var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Contract = new Schema({
  refEmployer: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  refWorker: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  refTask: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Task'
  },
  refBid: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Bid'
  },
  budget: {
    type: Number,
    required: true
  },
  isHourly: {
    type: Boolean,
    required: true
  },
  deadline: {
    type: Date,
    required: true
  },
  status: {
    type: Number,
    required: true,
    default: 0 // 0: interview, 1: started, 2: completed, 3: canceled
  },
  startDate: {
    type: Date,
    required: true
  },
  timestamp: {
    type: Date,
    required: true,
    default: new Date()
  }
});

module.exports = mongoose.model("Contract", Contract);