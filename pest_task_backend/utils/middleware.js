const logger = require("./logger");
const morgan =  require("morgan");
const jwt = require('jsonwebtoken');
const config = require("./config");
const User = require("../models/users");


const unknownEndpoint = (req, res) =>{res.status(404).send({error:"unknown end point"})}


const tokenExtractor = (req, res, next) => {
    const auth = req.headers['authorization'];
    if(auth && auth.startsWith("Bearer ")) req.token = auth.substring(7)
    next();
}


const userExtractor = async (req, res, next)=>{
    if(!req.token) return res.status(401).json({error:"Authentication Token missing"})
    const decodeToken = jwt.verify(req.token, config.SECRET) 
    if(!decodeToken) return res.status(401).json({error:"Token invalid"})
    req.user = await User.findById(decodeToken.id);
    next();
}


const errorHandler = (error, req, res, next) =>{
    logger.error(error.message);

    if(error.name === "CastError") return res.status(400).send({error: "Malformatted ID"})
    else if(error.name === "ValidationError") return res.status(400).send({error: error.message})
    else if(error.name === "MongoServerError" && error.message.includes("E11000 duplicate key error")) return res.status(400).send({error: "User already exist"})
    else if(error.name === "JsonWebTokenError") return res.status(400).send({error: "Token missing or invalid"})

    next();
}

module.exports = {
    unknownEndpoint,
    tokenExtractor,
    userExtractor,
    errorHandler,
}