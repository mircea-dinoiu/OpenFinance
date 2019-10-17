const express = require('express');
const router = express.Router();
const Controller = require('../controllers/ExpenseController');
const SuggestionController = require('../controllers/SuggestionController');
const filters = require('../filters');

router.get('/', filters.auth, (req, res) => {
    res.wrapPromise(Controller.list(req, res));
});

router.delete('/', filters.auth, async (req, res) => {
    res.wrapPromise(Controller.destroy(req, res));
});

router.put('/', filters.auth, async (req, res) => {
    res.wrapPromise(Controller.update(req, res));
});

router.post('/', filters.auth, async (req, res) => {
    res.wrapPromise(Controller.create(req, res));
});

router.get('/suggestions/categories', filters.auth, async (req, res) => {
    res.wrapPromise(SuggestionController.getCategories(req, res));
});

router.get('/suggestions/descriptions', filters.auth, async (req, res) => {
    res.wrapPromise(SuggestionController.getExpenseDescriptions(req, res));
});

module.exports = router;
