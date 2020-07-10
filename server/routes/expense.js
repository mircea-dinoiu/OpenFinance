const express = require('express');
const router = express.Router();
const Controller = require('../controllers/ExpenseController');
const SuggestionController = require('../controllers/SuggestionController');
const filters = require('../filters');

const c = new Controller();
const sc = new SuggestionController();

router.get('/', filters.auth, (req, res) => {
    res.wrapPromise(c.list(req, res));
});

router.delete('/', filters.auth, async (req, res) => {
    res.wrapPromise(c.destroy(req, res));
});

router.put('/', filters.auth, async (req, res) => {
    res.wrapPromise(c.update(req, res));
});

router.post('/', filters.auth, async (req, res) => {
    res.wrapPromise(c.create(req, res));
});

router.get('/suggestions/categories', filters.auth, async (req, res) => {
    res.wrapPromise(sc.getCategories(req, res));
});

router.get('/suggestions/descriptions', filters.auth, async (req, res) => {
    res.wrapPromise(sc.getExpenseDescriptions(req, res));
});

module.exports = router;
