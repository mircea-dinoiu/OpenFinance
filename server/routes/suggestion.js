const express = require('express');
const router = express.Router();
const Controller = require('../controllers/SuggestionController');
const filters = require('../filters');

router.get('/expense/categories', filters.auth, async (req, res) => {
    res.wrapPromise(Controller.getCategories(req, res));
});

router.get('/expense/descriptions', filters.auth, async (req, res) => {
    res.wrapPromise(Controller.getExpenseDescriptions(req, res));
});

module.exports = router;
