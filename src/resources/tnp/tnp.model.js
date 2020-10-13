const mongoose = require('mongoose')
const CryptoJS  = require('crypto-js')
const jwt = require('jsonwebtoken')
const joi = require("@hapi/joi");
const {secrets} = require('../../config')


const tnpSchema = new mongoose.Schema({
    email:{
        type: String,
        trim: true,
        unique: true,
        minlength: 6
    },
    password: {
        type: String,
        minlength: 6
    }
})

tnpSchema.methods.generateHash = (password)=>{
    return CryptoJS.SHA256(password).toString()
}
//using sha256 for tnp, because generating hash would be easier
tnpSchema.methods.validatePassword = (password,hashPassword)=>{
    // console.log(CryptoJS.SHA256(password).toString());
    if(CryptoJS.SHA256(password).toString() == hashPassword)
    return true
    else
    return false
}

tnpSchema.methods.generateAuthToken = (tnp)=>{
    return jwt.sign({ tnp }, secrets.jwt, {
        expiresIn: secrets.jwtExp
      });
}

function validateSchema(user) {
    const schema = joi.object().keys({
      email: joi
        .string()
        .min(5)
        .max(255)
        .required()
        .email(),
      password: joi
        .string()
        .min(5)
        .max(255)
        .required()
    });
    return schema.validate(user);
  }
  

const Tnp = mongoose.model("tnp",tnpSchema)
module.exports = {
    Tnp,
    Validate: validateSchema,
}











