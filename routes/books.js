const express = require('express');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const router = express.Router();

const bookCtrl = require('../controllers/books');

router.get('/', bookCtrl.getAllBooks);

router.get('/:id', bookCtrl.getOneBook);

router.get('/bestrating', bookCtrl.getBestBooks);

router.post('/', auth, multer, bookCtrl.createBook);

router.put('/:id', auth, multer, bookCtrl.modifyBook);

router.delete('/:id', auth, multer, bookCtrl.deleteBook);

//router.post('/:id/rating', auth, bookCtrl.rateOneBook);

module.exports = router;