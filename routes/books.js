const express = require('express');
//const auth = require('auth');

const router = express.Router();

const bookCtrl = require('../controllers/books');

router.get('/', bookCtrl.getAllBooks);

router.get('/:id', bookCtrl.getOneBook);

router.get('/bestrating', bookCtrl.getBestBooks);

router.post('/', bookCtrl.createBook);

router.put('/:id', bookCtrl.modifyBook);

router.delete('/:id', bookCtrl.deleteBook);

//router.post('/:id/rating', auth, bookCtrl.rateOneBook);

module.exports = router;