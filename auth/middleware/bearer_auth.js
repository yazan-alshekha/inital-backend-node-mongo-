"user strict";
const userModel = require('../model/schema.js');
const jwt = require("jsonwebtoken");
const SECRET = process.env.SECRET;


async function bearer_auth(req, res, next) {

    if (req.headers['authorization']) {
        // the shape will be like the next line 
        // Bearer token
        let bearerHeaderParts = req.headers.authorization.split(' ');
        // console.log("bearerHeaderParts>>>", bearerHeaderParts); //['Bearer','token']
        let token = bearerHeaderParts.pop();
        
        
        validateToken(token).then(() => {
            // req.user = user;
            next();
        }).catch(error=>{next(`invalid user or token ${error}`)})
      
    }

    
}

async function validateToken(token) {
    // in order to get the username , we are using token and secret key as an argument for verify method 
    // username = token+secret
    const parsedToken = jwt.verify(token, SECRET);
    
    let user = await userModel.findOne( { username:  parsedToken.username } );
    if (user) {

        return 
    }
    else {
        throw new Error("invalid token or user")
    }
}

module.exports = bearer_auth;