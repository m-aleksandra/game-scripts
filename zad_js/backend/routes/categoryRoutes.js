const express = require('express');
const Category = require('../models/Category');
const router = express.Router();

router.get('/', async (req, res) => {
    const categories = await Category.find();
    res.json(categories);
});

router.post('/', async (req, res) => {
    const newCategory = new Category(req.body);
    await newCategory.save();
    res.status(201).json(newCategory);
});

module.exports = router;
