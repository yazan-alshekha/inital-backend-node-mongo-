'use strict';

const bcrypt = require('bcrypt');
const express = require('express');
const userRouter = express.Router();
const userModel = require('./model/schema.js');
const basicAuth = require('./middleware/basic-auth');
const bearer_auth=require('./middleware/bearer_auth');

userRouter.post("/signup", async (req, res) => {
    try {

        req.body.password = await bcrypt.hash(req.body.password, 10);

        const newuser = new userModel(req.body)
        let user= await userModel.findOne({username:req.body.username});
        if (user) return res.status(400).send('User already registered.');
        else{

            newuser.save()
            res.status(200).json(newuser)
        }
    } catch (error) {
        res.status(403).send("Error Creating User");
    }
})

userRouter.post('/signin', basicAuth, async (req, res) => {
    const userInfo = req.user;
    res.status(200).json(userInfo);
})

// get the user by the auto-generated id by mongodb
userRouter.get('/user/:id', bearer_auth ,async( req , res ) => {
    let result=await userModel.find( {_id:req.params.id} )
    result[0].password="*****"
    res.status(200).json(result)
});

// get all the users 
userRouter.get('/user', bearer_auth ,async( req , res ) => {
    let results=await userModel.find()
    results.forEach((user)=> user.password="****");
    res.status(200).json(results)
});

// update the username for one of the users by his id  
userRouter.put('/user/:id', bearer_auth ,async( req , res ) => {
    let userId=req.params.id;
    let newUserName=req.body.username;
    
    //You should set the "new" option to true to return the document after update was applied.  {new:true} 
    let result = await userModel.findByIdAndUpdate( userId , {username:newUserName}, {new:true} );

    console.log(result);
    res.status(200).json(result)
    
});

// delete one user by his id 
userRouter.delete('/user/:id', bearer_auth ,async( req , res ) => {
    let userId=req.params.id;

    let result = await userModel.findByIdAndRemove( userId);

    res.status(200).json(`${result.username} was deleted successfully`)
    
});

module.exports = userRouter;