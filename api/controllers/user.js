const bcrypt = require('bcrypt');
const User = require('../models/user');
const generateToken = require('../utils/generateToken')

exports.registerUser = (req,res,next) => {
    User.find({email:req.body.email})
    .exec()
    .then(user => {
         if(user.length >=1) {
             return res.status(401).json({
                 message:'user alredy exits'
             })
         }else {
             bcrypt.hash(req.body.password,10,(err,hash)=> {
                 if(err) {
                     return res.status(500).json({
                         message:err.message
                     })
                 }
                 if(hash) {
                     const user = new User({
                         name:req.body.name,
                         email:req.body.email,
                         password:hash
                     })
                     user.save().then(user => {
                          return res.status(200).json({
                              message:"user created",
                              user:user
                          })
                     }).catch(err => {
                        return res.status(500).json({
                            message:err.message
                        })
                     });
                 }
             })
         }
    })
    .catch(err => {
        res.status(500).json({
            error:err.message
        })
    })
}

exports.getUsers = (req,res,next) => {
    User.find({})
    .exec()
    .then(users => {
       res.status(200).json({
           message:'current users',
           users
       })
    })
    .catch(err => {
        res.status(500).json({
            message:err.message
        })
    })
}

exports.loginUsers = (req,res,next) => {
    User.find({email:req.body.email})
    .exec()
    .then(user => {
        if(user.length <1) {
            return res.status(409).json({
                message:"register first"
            })
        }else {
            bcrypt.compare(req.body.password,user[0].password,(err,compared) => {
                if(err) {
                    return res.status(401).json({
                        message:err.message
                    })
                }
                if(compared) {
                    return res.status(201).json({
                        message:'logged in succesfully',
                        token:generateToken(user[0]._id)
                    })
                }
            })
        }
    })
    .catch(err => {
        res.status(500).json({
            message:err.message
        })
    })
}


exports.getUserProfile = (req,res,next) => {
    const id = req.user._id;
    User.findById(id)
        .exec()
        .then(user => {
            res.status(200).json({
               user,
               message:'user profile'
            })
        })
        .catch(err => {
            res.status(500).json({
                message:err.message
            })
        })
}

exports.deleteUser = (req,res,next) => {
    const id = req.params.id;
    User.findOneAndDelete(id)
         .exec()
         .then( user => {
             res.status(200).json({
                 user,
                 message:"user deleted"
             })
         })
         .catch(err => {
             res.status(500).json({
                 message:err.message
             })
         })
}