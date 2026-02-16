// logique signup/login + hashage du mdp

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// signup
exports.signup = (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({ error: 'Email et mot de passe requis' });
  }


  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash
      });
      
      user.save()
        .then(() => res.status(201).json({ 
          message: 'Utilisateur créé avec succès !' 
        }))
        .catch(error => {
          if (error.code === 11000) {
            return res.status(400).json({ 
              error: 'Cet email est déjà utilisé' 
            });
          }
          if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors)
              .map(err => err.message)
              .join(', ');
            return res.status(400).json({ error: messages });
          }
          
          console.error('Erreur signup:', error);
          res.status(500).json({ error: 'Erreur lors de la création du compte' });
        });
    })
    .catch(error => {
      console.error('Erreur hashage:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    });
};

// login
exports.login = (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({ error: 'Email et mot de passe requis' });
  }

  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
      }
      
      bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
          }
          
          // génération token
          const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
          );
          
          // réponse avec le token
          res.status(200).json({
            userId: user._id,
            email: user.email,
            token: token
          });
        })
        .catch(error => {
          console.error('Erreur bcrypt:', error);
          res.status(500).json({ error: 'Erreur serveur' });
        });
    })
    .catch(error => {
      console.error('Erreur login:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    });
};
