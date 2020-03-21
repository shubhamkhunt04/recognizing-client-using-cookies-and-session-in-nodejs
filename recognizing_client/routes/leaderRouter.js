const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const Leader = require("../models/leaders"); 

const leaders = express.Router();

leaders.use(bodyParser.json());

leaders.route('/')
.get((req,res,next)=>{
    Leader.find({})
    .then((leader)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(leader);
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.post((req,res,next)=>{
    Leader.create(req.body)
    .then((leader)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(leader);
    },
        (err)=>next(err))
    .catch((err)=>next(err));
})
.put((req,res,next)=>{
    res.statusCode = 403;
    res.end('PUT operation dose not support on /leader');
})
.delete((req,res,next)=>{
    Leader.remove({})
    .then((resp)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(resp);
    },
    (err)=>next(err))
.catch((err)=>next(err));
});




leaders.route('/:leadersId')
.get((req,res,next)=>{
    Leader.findById(req.params.leadersId)
    .then((leader)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(leader);
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.post((req,res,next)=>{
    res.statusCode = 403;
    res.end('POST operation not supported on /leaders/'+req.params.leadersId);
})
.put((req,res,next)=>{
    Leader.findByIdAndUpdate(req.params.leadersId,{
        $set:req.body
    },{new :true})
    .then((leader)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(leader);
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.delete((req,res,next)=>{
    Leader.findByIdAndRemove(req.params.leadersId)
    .then((resp)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(resp);
    },
    (err)=>next(err))
.catch((err)=>next(err));
});


module.exports = leaders;