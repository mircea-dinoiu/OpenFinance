const express = require('express');
const router = express.Router();
const Controller = require('../controllers/SuggestionController');
const filters = require('../filters');

router.get('/categories', filters.auth, async (req, res) => {
    res.wrapPromise(Controller.getCategories(req, res));
});

module.exports = router;
