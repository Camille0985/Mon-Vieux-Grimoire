const Book = require('../models/Book');
const fs = require('fs');

exports.getAllBooks = (req, res, next) => {
  Book.find()
  .then(books => res.status(200).json(books))
  .catch(error => res.status(400).json({ error }));
};

exports.getBestBooks = (req, res, next) => {
  Book.find()
  .sort({ averageRating: -1 })
  .limit(3)
  .then(books => res.status(200).json(books))
  .catch(error => res.status(400).json({ error }));
};

exports.getOneBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
  .then(book => res.status(200).json(book))
  .catch(error => res.status(404).json({ error }));
};

exports.createBook = (req, res, next) => {
  const bookObject = JSON.parse(req.body.book);
  const book = new Book({
    ...bookObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  book.save()
  .then(() => { res.status(201).json({ message: 'Livre enregristré !' })})
  .catch(error => { res.status(400).json({ error })});
};

exports.modifyBook = (req, res, next) => {
  const bookObject = req.file ? {
    ...JSON.parse(req.body.book),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };

  delete bookObject._userId;
  Book.findOne({_id: req.params.id})
  .then((book) => {
    if (book.userId != req.auth.userId) {
      res.status(400).json({ message: 'Non autorisé' });
    } else {
      Book.updateOne({ _id: req.params.id}, { ...bookObject, _id: req.params.id})
      .then(() => res.status(200).json({ message: 'Livre modifié !'}))
      .catch(error => res.status(404).json({ error }));
    }
  })
  .catch((error) => { res.status(400).json({ error })});
};

exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
  .then(book => {
    if (book.userId != req.auth.userId) {
      res.status(401).json({ message: 'Non autorisé' });
    } else {
      const filename = book.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Book.deleteOne({ _id: req.params.id })
        .then(() => { res.status(200).json({ message: 'Livre supprimé !' })})
        .catch(error => res.status(401).json({ error }));
      });
    }
  })
  .catch( error => {res.status(500).json({ error })});
};

exports.rateOneBook = (req, res, next) => {
  const userId = req.auth.userId;
  const { rating } = req.body;

  Book.findById(req.params.id)
  .then((book) => {
    if (!book) {
      return res.status(404).json({ error });
    }
    const userRating = book.ratings.find((rating) => rating.userId === userId);
    if (userRating) {
      return res.status(400).json({ error });
    }

    book.ratings.push({ userId, grade: rating });
    book.averageRating = (book.ratings.reduce((total, rating) => total + rating.grade, 0) + rating) / (book.ratings.length + 1);
      
    book.averageRating = book.averageRating.toFixed(1);
      
    return book.save();
  })
  .then((book) => {
    return Book.findByIdAndUpdate(req.params.id, book, { new: true });
  })
  .then((updatedBook) => {
    res.status(200).json(updatedBook);
  })
  .catch((error) => {
    res.status(500).json({ error });
  });
};
