var mongoose = require('mongoose');

mongoose.connect('mongodb://<user>:<pass>@<database>',function(err){
    if(err) throw err;
}) ;
// mongoose.connect('mongodb://ayandeyeman:locked@ds047792.mongolab.com:47792/ayandeyeman',function(err){
//     if(err) throw err;
// }) ;

module.exports = mongoose.connection;
