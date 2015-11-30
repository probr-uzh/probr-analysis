/**
 * Created by seebi on 28.11.15.
 */

var mongoose = require('mongoose');

var LogSchema = new mongoose.Schema({
    time: {type: Date, index: true},
    job: String,
    type: {type: String, enum: ['started', 'finished', 'error']},
    message: String,
    data: mongoose.Schema.Types.Mixed
});

var Log = mongoose.model('logs', LogSchema, 'logs');

module.exports = Log;
