const express = require('express');
const { Test } = require('../models/test')
const router = express.Router();

router.get('/', async (req, res) => {
   res.send("hello");
})

router.post('/', async (req, res) => {
    const test = new Test({
        title: req.body.title
    });

    try {
        await test.save();
        res.send(test);
    } catch (error) {
        res.send(error);
    }
})

module.exports = router;