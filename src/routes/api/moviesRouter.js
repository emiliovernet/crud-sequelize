const express = require('express');

const moviesController = require('../../controllers/api/moviesController');

const router = express.Router();

router.get('/', moviesController.list);
router.post('/create', moviesController.create);
router.get('/:id', moviesController.getById);
router.delete('/delete/:id', moviesController.delete)

module.exports = router;