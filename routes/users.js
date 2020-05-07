const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');

router.get('/register',[
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
});

module.exports = router;