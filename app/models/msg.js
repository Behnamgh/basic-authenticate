// load the things we need
var mongoose = require('mongoose');



var msgSchema = mongoose.Schema({


        email       : String,
        subject     : String,
        letter      : String,
        date        : Date
});

module.exports = mongoose.model('Msg', msgSchema);
