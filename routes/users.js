const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');
const User = require('../models/users');
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");


//Register Route
router.post('/register',[
    check('name','Name is required')
        .not()
        .isEmpty(),
    check('email','Please include a valid email')
        .isEmail(),
    check('password','Password should contain atleast 6 characters')
        .isLength({min:6})        
], async (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    const {name,email,password} = req.body;

    try {
        let user = await User.findOne({email});

        if(user){
            return res.status(400).json({errors:[{msg:'User already exists'}]});
        }

        user = new User({
            name,
            email,
            password
        })

        await user.save();
        console.log(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


//Login Route
router.post('/login',[
    check('email','Email is required')
        .isEmail(),
    check('password','Password field is required')
        .isLength({min:1})    
], async (req,res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()[0].msg});
    }

    
    const {email,password} = req.body;

    try {
        
        const user = await User.findOne({email});

        if(!user){
            return res.status(400).json({errors:[{msg:'Invalid Credentials'}]});
        }

        if (!user.autheticate(password)) {
            return res.status(401).json({
              error: "Email and password do not match"
            });
          }

          const token = jwt.sign({ _id: user._id }, "shhhh");
          //put token in cookie
          res.cookie("token", token, { expire: new Date() + 9999 });
      
          //send response to front end
          const { _id, name, role } = user;
          return res.json({ token, user: { _id, name, email, role } });
          
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Serversss error');
    }

});

//Logout 
router.get('/logout',(req,res) => {
    res.clearCookie("token");
    res.json({
        message:"User Logout"
    });
});

module.exports = router;