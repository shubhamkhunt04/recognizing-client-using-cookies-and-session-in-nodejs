const mongoose = require('mongoose');
const Schema = mongoose.Schema;

require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

const promoSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String
    },
    lable: {
        type: String,
        default:''
    },
    price:{
        type:Currency,
        min:0
    },
    description:{
        type:String,
        required:true
    }
}, {
    timestamps: true
});

var Promos = mongoose.model('Promo',promoSchema);

module.exports = Promos;