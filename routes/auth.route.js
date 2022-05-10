const { response } = require('express');
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Student = require('../model/Student.js');
const router = express.Router();
const Joi = require('@hapi/joi');


// VALIDATION SCHEMA
const schema = Student;

// signIn user
router.post('/login', async (req, res) => {
    // validating data before saving
    // const { error } = Joi.validate(req.body, schema);
    // if (error) return res.status(400).json({ success: false, error: error.details[0].message })

    // Checking if the username already exists
    try {
        const user = await schema.findOne({ idNo: req.body.idNo.toUpperCase() });
        if (!user) return res.status(400).json({ success: false, error: `Enter valid credentials` });

        // checking the password is valid
        const valPass = await bcrypt.compare(req.body.password, user.password);
        if (!valPass) res.status(400).json({ success: false, error: 'Invalid password' })

        const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET)
        res.status(400).setHeader('auth-token', token).json({ success: true, message: `welcome back ${req.body.idNo}`, token: token })

    } catch (err) { res.status(400).json({ success: false, error: "Error perfoming action" }) }

})

// signUp users
router.post('/register', async (req, res) => {

    // validating data before saving
    // const { error } = Joi.validate(req.body, schema);
    // if (error) return res.status(400).json({ success: false, error: error.details[0].message })

    // Checking if the username already exists
    try {
        const isUser = await schema.findOne({ idNo: req.body.idNo.toUpperCase() });
        if (isUser) return res.status(400).json({ success: false, error: `${req.body.idNo} had already been taken` });
    } catch (err) { res.status(400).json({ success: false, error: "error finding user" }) }

    // Hashing password
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);

    // creating new User
    const user = new schema({
        name: req.body.name,
        idNo: req.body.idNo.toUpperCase(),
        class: req.body.class,
        branch: req.body.branch,
        batch: req.body.batch,
        address: req.body.address,
        contactNumber: req.body.contactNumber,
        password: hashedPass
    });
    try {
        await user.save();
        res.status(200).json({ success: true, message: 'Account created successfully' });

    } catch (err) { res.status(400).json({ success: false, error: "Err" }) }
})

module.exports = router;