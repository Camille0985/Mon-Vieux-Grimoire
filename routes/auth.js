/*const express = require('express');
const router = express.Router();

const User = require('../models/User');

router.post('/signup', (req, res, next) => {
    delete req.body._id;
    const user = new User({
      ...req.body
    });
    user.save()
    .then(() => res.status(201).json({ message: 'Utilisateur enregistré !' }))
    .catch(error => res.status(400).json({ error }));
  });
  
  router.get('/:id', (req, res, next) => {
    User.findOne({ _id: req.params.id })
    .then(user => res.status(200).json(user))
    .catch(error => res.status(404).json({ error }));
  })
  
    router.get('/login', (req, res, next) => {
    User.find()
    .then(users => res.status(200).json(users))
    .catch(error => res.status(400).json({ error }));
  });*/