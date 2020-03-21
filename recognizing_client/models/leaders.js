const mongoose = require('mongoose');
const Schema = mongoose.Schema;

require('mongoose-currency').loadType(mongoose);

const leadSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String
    },
    designation:{
        type:String,
        required:true
    },
    abbr: {
        type: String,
        default:''
    },
    description:{
        type:String,
        required:true
    }
}, {
    timestamps: true
});

var Lead = mongoose.model('Lead',leadSchema);

module.exports = Lead;