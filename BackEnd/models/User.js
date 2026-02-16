//Structure des utilisateurs

const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  email: { 
    type: String, 
    required: [true, 'Email requis'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: 'Email invalide'
    }
  },
  password: { 
    type: String, 
    required: [true, 'Mot de passe requis'],
    minlength: [6, 'Le mot de passe doit contenir au moins 6 caractères']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
