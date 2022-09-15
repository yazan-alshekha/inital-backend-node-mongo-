'use strict';

const bcrypt = require('bcrypt');
const base64 = require('base-64');
const jwt = require("jsonwebtoken");
const SECRET = process.env.SECRET;

const userModel = require('../model/schema.js');


async function basicAuth(req, res, next) {

    let basicHeaderParts = req.headers.authorization.split(' ')[1];

    let decodedString = base64.decode(basicHeaderParts);
    let [username, password] = decodedString.split(':');


    try {

        let user = await userModel.findOne({ username: username });
        const valid = await bcrypt.compare(password, user.password);


        if (valid) {
            let newToken = jwt.sign({ username: user.username }, SECRET);

            res.status(200).json({
                user: {
                    _id: user._id,
                    username: user.username
                },
                token: newToken
            });
            next();
        }
        else {
            throw new Error('Invalid User');
        }
    } catch (error) {

        res.status(403).send('Invalid Login')
    }


}

module.exports = basicAuth;