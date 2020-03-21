const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const Promo = require("../models/promotions"); 

const promotions = express.Router();

promotions.use(bodyParser.json());

promotions.route('/')
.get((req,res,next)=>{
    Promo.find({})
    .then((promotion)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(promotion);
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.post((req,res,next)=>{
    Promo.create(req.body)
    .then((promotion)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(promotion);
    },
        (err)=>next(err))
    .catch((err)=>next(err));
})
.put((req,res,next)=>{
    res.statusCode = 403;
    res.end('PUT operation dose not support on /dishes');
})
.delete((req,res,next)=>{
    Promo.remove({})
    .then((resp)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(resp);
    },
    (err)=>next(err))
.catch((err)=>next(err));
});




promotions.route('/:promotionsId')
.get((req,res,next)=>{
    Promo.findById(req.params.promotionsId)
    .then((promotion)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(promotion);
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.post((req,res,next)=>{
    res.statusCode = 403;
    res.end('POST operation not supported on /dishes/'+req.params.promotionsId);
})
.put((req,res,next)=>{
    Promo.findByIdAndUpdate(req.params.promotionsId,{
        $set:req.body
    },{new :true})
    .then((promotion)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(promotion);
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.delete((req,res,next)=>{
    Promo.findByIdAndRemove(req.params.promotionsId)
    .then((resp)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(resp);
    },
    (err)=>next(err))
.catch((err)=>next(err));
});



module.exports = promotions;